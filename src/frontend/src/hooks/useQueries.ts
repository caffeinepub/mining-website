import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Transaction, MiningTask, RichUserProfile, UserApprovalInfo } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerApproved() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isApproved'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerApproved();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestApproval();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isApproved'] });
    },
  });
}

export function useGetBalances() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['balances'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBalances();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Transaction]>>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ walletAddress, amount }: { walletAddress: string; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestWithdrawal(walletAddress, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetMiningTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, MiningTask]>>({
    queryKey: ['miningTasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMiningTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Poll every 10 seconds for active mining updates
  });
}

export function useStartMining() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (duration: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startMining(duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['miningTasks'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useLinkTelegram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.linkTelegram();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
  });
}

export function useGetTelegramLink() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['telegramLink'],
    queryFn: async () => {
      if (!actor) return '';
      return actor.getTelegramLink();
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin queries
export function useGetAllTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[bigint, Transaction]>>({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawal(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    },
  });
}

export function useRejectWithdrawal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWithdrawal(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    },
  });
}

export function useListApprovals() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<UserApprovalInfo>>({
    queryKey: ['userApprovals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listApprovals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetApproval() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, status }: { user: Principal; status: { approved: null } | { rejected: null } | { pending: null } }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setApproval(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userApprovals'] });
    },
  });
}

export function useGetAllUserProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<RichUserProfile>>({
    queryKey: ['allUserProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}
