import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Admin-only functionality
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  let approvalState = UserApproval.initState(accessControlState);

  type Wallet = Text;
  type Amount = Nat;

  type TransactionState = {
    #pending;
    #approved;
    #rejected;
  };

  type Transaction = {
    amount : Amount;
    toWallet : Wallet;
    state : TransactionState;
    user : Principal;
  };

  type MiningState = {
    #notStarted;
    #active;
    #expired;
  };

  type MiningTask = {
    startTime : Int;
    duration : Nat;
    state : MiningState;
    user : Principal;
  };

  public type UserProfile = {
    wallet : Wallet;
    balance : Amount;
    miningCount : Nat;
    telegramFollowed : Bool;
  };

  type RichUserProfile = {
    principal : Principal;
    wallet : Wallet;
    balance : Amount;
    miningCount : Nat;
    telegramFollowed : Bool;
  };

  var nextTransactionId : Nat = 0;
  var nextMiningTaskId : Nat = 0;

  // User accounts - using Map for efficient lookups
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Pending transactions
  let transactions = Map.empty<Nat, Transaction>();

  // Mining tasks
  let miningTasks = Map.empty<Nat, MiningTask>();

  // User/Approval management
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // Required: Get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Required: Get another user's profile (admin or self only)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Required: Save caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Assign role (admin only, already guarded in AccessControl.assignRole)
  public shared ({ caller }) func assignRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // Get caller's balance
  public query ({ caller }) func getBalances() : async Amount {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can view balances");
    };
    switch (userProfiles.get(caller)) {
      case (?user) { user.balance };
      case (null) { 0 };
    };
  };

  // Get caller's own transactions
  public query ({ caller }) func getTransactions() : async [(Nat, Transaction)] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can view transactions");
    };

    let allTransactions = transactions.toArray();
    allTransactions.filter<(Nat, Transaction)>(
      func((id, tx)) { tx.user == caller }
    );
  };

  // Get caller's own mining tasks
  public query ({ caller }) func getMiningTasks() : async [(Nat, MiningTask)] {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can view mining tasks");
    };

    let allTasks = miningTasks.toArray();
    allTasks.filter<(Nat, MiningTask)>(
      func((id, task)) { task.user == caller }
    );
  };

  // Start mining (user only)
  public shared ({ caller }) func startMining(duration : Nat) : async Text {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can start mining");
    };

    if (duration < 1 or duration > 5) {
      Runtime.trap("Mining duration must be between 1 and 5 days");
    };

    let now = Time.now();

    let task : MiningTask = {
      startTime = now;
      duration;
      state = #active;
      user = caller;
    };

    miningTasks.add(nextMiningTaskId, task);

    // Update user miningCount
    switch (userProfiles.get(caller)) {
      case (?profile) {
        userProfiles.add(caller, {
          profile with
          miningCount = profile.miningCount + 1;
        });
      };
      case (null) {
        // Create new profile if doesn't exist
        let newProfile : UserProfile = {
          wallet = "";
          balance = 0;
          miningCount = 1;
          telegramFollowed = false;
        };
        userProfiles.add(caller, newProfile);
      };
    };

    nextMiningTaskId += 1;

    "Mining task started for " # duration.toText() # " days";
  };

  // Request withdrawal (user only)
  public shared ({ caller }) func requestWithdrawal(walletAddress : Text, amount : Amount) : async Text {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    if (amount < 20) {
      return "Minimum withdrawal is 20 USDT";
    };

    // Check if user has sufficient balance
    switch (userProfiles.get(caller)) {
      case (?user) {
        if (user.balance < amount) {
          return "Insufficient balance";
        };
      };
      case (null) {
        return "User profile not found";
      };
    };

    let transaction : Transaction = {
      amount;
      toWallet = walletAddress;
      state = #pending;
      user = caller;
    };

    transactions.add(nextTransactionId, transaction);
    nextTransactionId += 1;
    "Withdrawal request submitted";
  };

  // Link Telegram account (user only)
  public shared ({ caller }) func linkTelegram() : async Bool {
    if (not (UserApproval.isApproved(approvalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only users can link Telegram");
    };

    switch (userProfiles.get(caller)) {
      case (?profile) {
        switch (profile.telegramFollowed) {
          case (true) { return false };
          case (false) {
            userProfiles.add(caller, {
              profile with
              telegramFollowed = true;
              balance = profile.balance + 15; // 1.5 USDT = 15 (assuming 10x multiplier)
            });
            return true;
          };
        };
      };
      case (null) {
        // Create new profile with bonus
        let newProfile : UserProfile = {
          wallet = "";
          balance = 15;
          miningCount = 0;
          telegramFollowed = true;
        };
        userProfiles.add(caller, newProfile);
        return true;
      };
    };
  };

  // Admin only: Get all user profiles
  public query ({ caller }) func getAllUserProfiles() : async [RichUserProfile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };

    let profiles = userProfiles.toArray();
    profiles.map<(Principal, UserProfile), RichUserProfile>(
      func((principal, profile)) {
        {
          principal;
          wallet = profile.wallet;
          balance = profile.balance;
          miningCount = profile.miningCount;
          telegramFollowed = profile.telegramFollowed;
        };
      }
    );
  };

  // Admin only: Get all transactions
  public query ({ caller }) func getAllTransactions() : async [(Nat, Transaction)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };
    transactions.toArray();
  };

  // Admin only: Get all mining tasks
  public query ({ caller }) func getAllMiningTasks() : async [(Nat, MiningTask)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all mining tasks");
    };
    miningTasks.toArray();
  };

  // Admin only: Approve withdrawal
  public shared ({ caller }) func approveWithdrawal(transactionId : Nat) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawals");
    };

    switch (transactions.get(transactionId)) {
      case (?tx) {
        if (tx.state != #pending) {
          return "Transaction is not pending";
        };

        // Update transaction state
        let updatedTx = {
          tx with state = #approved;
        };
        transactions.add(transactionId, updatedTx);

        // Deduct balance from user
        if (tx.amount > 0) {
          switch (userProfiles.get(tx.user)) {
            case (?profile) {
              userProfiles.add(tx.user, {
                profile with
                balance = profile.balance - tx.amount;
              });
            };
            case (null) {};
          };
        };

        "Withdrawal approved";
      };
      case (null) {
        "Transaction not found";
      };
    };
  };

  // Admin only: Reject withdrawal
  public shared ({ caller }) func rejectWithdrawal(transactionId : Nat) : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject withdrawals");
    };

    switch (transactions.get(transactionId)) {
      case (?tx) {
        if (tx.state != #pending) {
          return "Transaction is not pending";
        };

        let updatedTx = {
          tx with state = #rejected;
        };
        transactions.add(transactionId, updatedTx);
        "Withdrawal rejected";
      };
      case (null) {
        "Transaction not found";
      };
    };
  };

  // Public: Get Telegram link (no auth required)
  public query func getTelegramLink() : async Text {
    "https://t.me/Goldhunterfx345";
  };
};
