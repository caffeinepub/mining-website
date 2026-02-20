import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type Wallet = string;
export interface MiningTask {
    startTime: bigint;
    duration: bigint;
    user: Principal;
    state: MiningState;
}
export interface RichUserProfile {
    principal: Principal;
    balance: Amount;
    telegramFollowed: boolean;
    wallet: Wallet;
    miningCount: bigint;
}
export type Amount = bigint;
export interface UserProfile {
    balance: Amount;
    telegramFollowed: boolean;
    wallet: Wallet;
    miningCount: bigint;
}
export interface Transaction {
    user: Principal;
    state: TransactionState;
    amount: Amount;
    toWallet: Wallet;
}
export enum MiningState {
    notStarted = "notStarted",
    active = "active",
    expired = "expired"
}
export enum TransactionState {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveWithdrawal(transactionId: bigint): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    getAllMiningTasks(): Promise<Array<[bigint, MiningTask]>>;
    getAllTransactions(): Promise<Array<[bigint, Transaction]>>;
    getAllUserProfiles(): Promise<Array<RichUserProfile>>;
    getBalances(): Promise<Amount>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMiningTasks(): Promise<Array<[bigint, MiningTask]>>;
    getTelegramLink(): Promise<string>;
    getTransactions(): Promise<Array<[bigint, Transaction]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    linkTelegram(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    rejectWithdrawal(transactionId: bigint): Promise<string>;
    requestApproval(): Promise<void>;
    requestWithdrawal(walletAddress: string, amount: Amount): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    startMining(duration: bigint): Promise<string>;
}
