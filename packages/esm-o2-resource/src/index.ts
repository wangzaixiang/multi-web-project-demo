// Import for side effects (custom element registration)
import './components/resource-tree/o2-resource-tree';
import './components/resource-searcher/o2-resource-searcher';

// Export classes for direct use
export { O2ResourceTree } from './components/resource-tree/o2-resource-tree';
export { O2ResourceSearcher, type SearchResult } from './components/resource-searcher/o2-resource-searcher';
export { ResourceService } from './services/resource-service';