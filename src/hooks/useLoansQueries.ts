import { useQuery } from '@tanstack/react-query';
import { loansService } from '../services';
import { queryKeys } from './queryKeys';
import type { LoanMarketplaceFilters } from '@/types/models';

export function useLoanMarketplaceQuery(params?: LoanMarketplaceFilters) {
  return useQuery({
    queryKey: queryKeys.loans.marketplace(params),
    queryFn: () => loansService.getMarketplace(params),
  });
}

export function useEligibleProductsQuery(params?: LoanMarketplaceFilters) {
  return useQuery({
    queryKey: queryKeys.loans.eligible(params),
    queryFn: () => loansService.getEligibleProducts(params),
  });
}

export function useLoanProductQuery(productId: string, params?: LoanMarketplaceFilters) {
  return useQuery({
    queryKey: queryKeys.loans.product(productId, params),
    queryFn: () => loansService.getProductById(productId, params),
    enabled: Boolean(productId),
  });
}
