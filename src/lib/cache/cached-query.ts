import { dbQueryCache } from './db-query-cache';

// Import cache keys and TTL directly
import { cacheKeys, cacheTTL } from './db-query-cache';

// Re-export for convenience
export { cacheKeys, cacheTTL };

// Generic cached query function
export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl: number = 300000
): Promise<T> {
  // Try to get from cache first
  const cached = dbQueryCache.get(cacheKey);
  if (cached) {
    console.log(`🚀 Cache HIT: ${cacheKey}`);
    return cached as T;
  }

  // Cache miss - execute query
  console.log(`💾 Cache MISS: ${cacheKey} - executing query`);
  const startTime = Date.now();
  
  try {
    const result = await queryFn();
    const queryTime = Date.now() - startTime;
    
    // Cache the result
    dbQueryCache.set(cacheKey, result, ttl);
    
    console.log(`✅ Query completed: ${cacheKey} in ${queryTime}ms`);
    return result;
  } catch (error) {
    console.error(`❌ Query failed: ${cacheKey}`, error);
    throw error;
  }
}

// Specific cached query functions for common patterns
export async function cachedUserQuery(userId: string, queryFn: () => Promise<unknown>) {
  return cachedQuery(
    `user:${userId}`,
    queryFn,
    cacheTTL.user
  );
}

export async function cachedUserWithPlanQuery(userId: string, queryFn: () => Promise<unknown>) {
  return cachedQuery(
    `userWithPlan:${userId}`,
    queryFn,
    cacheTTL.userWithPlan
  );
}

export async function cachedPostsQuery(limit?: number, offset?: number, queryFn?: () => Promise<unknown>) {
  if (!queryFn) return null;
  
  return cachedQuery(
    `posts:${limit || 'all'}:${offset || 0}`,
    queryFn,
    cacheTTL.posts
  );
}

export async function cachedGearQuery(limit?: number, offset?: number, queryFn?: () => Promise<unknown>) {
  if (!queryFn) return null;
  
  return cachedQuery(
    `gear:${limit || 'all'}:${offset || 0}`,
    queryFn,
    cacheTTL.gear
  );
}

export async function cachedUserInteractionsQuery(postIds: string[], queryFn: () => Promise<unknown>) {
  return cachedQuery(
    `userInteractions:${postIds.sort().join(',')}`,
    queryFn,
    cacheTTL.userInteractions
  );
}

// Cache invalidation helpers
export function invalidateUserCache(userId: string) {
  dbQueryCache.delete(`user:${userId}`);
  dbQueryCache.delete(`userWithPlan:${userId}`);
  dbQueryCache.delete(`userPosts:${userId}`);
  dbQueryCache.delete(`userGear:${userId}`);
  dbQueryCache.delete(`savedPosts:${userId}`);
  dbQueryCache.delete(`savedGear:${userId}`);
  console.log(`🗑️ Invalidated user cache for: ${userId}`);
}

export function invalidatePostsCache() {
  // Clear all posts-related cache
  const stats = dbQueryCache.getStats();
  console.log(`🗑️ Invalidated posts cache. Cache stats:`, stats);
  // Note: This is a placeholder - in a real implementation, you'd clear specific cache keys
}

export function invalidateGearCache() {
  // Clear all gear-related cache
  const stats = dbQueryCache.getStats();
  console.log(`🗑️ Invalidated gear cache. Cache stats:`, stats);
  // Note: This is a placeholder - in a real implementation, you'd clear specific cache keys
}
