// Simple in-memory cache for database queries
class DatabaseQueryCache {
  private cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

  // Cache a database query result
  set(key: string, data: unknown, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get cached data if still valid
  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Clear specific cache entry
  delete(key: string) {
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(([, item]) => now - item.timestamp <= item.ttl).length,
      expiredEntries: entries.filter(([, item]) => now - item.timestamp > item.ttl).length,
      memoryUsage: JSON.stringify(Array.from(this.cache.values())).length
    };
  }
}

// Export singleton instance
export const dbQueryCache = new DatabaseQueryCache();

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userWithPlan: (userId: string) => `userWithPlan:${userId}`,
  posts: (limit?: number, offset?: number) => `posts:${limit || 'all'}:${offset || 0}`,
  userPosts: (userId: string) => `userPosts:${userId}`,
  gear: (limit?: number, offset?: number) => `gear:${limit || 'all'}:${offset || 0}`,
  userGear: (userId: string) => `userGear:${userId}`,
  savedPosts: (userId: string) => `savedPosts:${userId}`,
  savedGear: (userId: string) => `savedGear:${userId}`,
  userInteractions: (postIds: string[]) => `userInteractions:${postIds.sort().join(',')}`,
  bookings: (userId: string, type?: string) => `bookings:${userId}:${type || 'all'}`,
  stripeAccount: (userId: string) => `stripeAccount:${userId}`,
};

// Cache TTL constants (in milliseconds)
export const cacheTTL = {
  user: 300000, // 5 minutes
  userWithPlan: 300000, // 5 minutes
  posts: 180000, // 3 minutes
  userPosts: 300000, // 5 minutes
  gear: 240000, // 4 minutes
  userGear: 300000, // 5 minutes
  savedPosts: 300000, // 5 minutes
  savedGear: 300000, // 5 minutes
  userInteractions: 180000, // 3 minutes
  bookings: 300000, // 5 minutes
  stripeAccount: 600000, // 10 minutes
};
