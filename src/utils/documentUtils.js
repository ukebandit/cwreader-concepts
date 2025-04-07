/**
 * Utility functions for document operations
 */

/**
 * Flatten a nested section structure into a flat array
 * @param {Array} sections - Array of section objects with potential subsections
 * @param {Array} results - Accumulator for results
 * @returns {Array} Flat array of all sections
 */
export const flattenSections = (sections, results = []) => {
  if (!sections || !Array.isArray(sections)) return results;
  
  sections.forEach(section => {
    results.push(section);
    if (section.subsections && section.subsections.length > 0) {
      flattenSections(section.subsections, results);
    }
  });
  return results;
};

/**
 * Find a section by its ID in a nested structure
 * @param {Array} sections - Array of section objects
 * @param {string} id - ID to search for
 * @returns {Object|null} Found section or null
 */
export const findSectionById = (sections, id) => {
  if (!sections || !Array.isArray(sections) || !id) return null;
  
  for (const section of sections) {
    if (section.id === id) {
      return section;
    }
    if (section.subsections && section.subsections.length > 0) {
      const found = findSectionById(section.subsections, id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Get breadcrumb trail for a section by ID
 * @param {Array} sections - Array of section objects
 * @param {string} targetId - Target section ID
 * @param {Array} trail - Accumulator for the trail
 * @returns {Array} Array of sections representing the breadcrumb trail
 */
export const getBreadcrumbs = (sections, targetId, trail = []) => {
  if (!sections || !Array.isArray(sections) || !targetId) return [];
  
  for (const section of sections) {
    if (section.id === targetId) {
      return [...trail, section];
    }
    
    if (section.subsections?.length) {
      const newTrail = [...trail, section];
      const found = getBreadcrumbs(section.subsections, targetId, newTrail);
      if (found.length) return found;
    }
  }
  
  return [];
};

/**
 * Calculate reading progress percentage
 * @param {string} activeSection - Current active section ID
 * @param {Array} sections - Array of all document sections
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (activeSection, sections) => {
  if (!activeSection || !sections || !Array.isArray(sections)) return 0;
  
  const allSections = flattenSections(sections);
  const currentIndex = allSections.findIndex(section => section.id === activeSection);
  
  if (currentIndex === -1) return 0;
  return Math.round((currentIndex + 1) / allSections.length * 100);
};

/**
 * Search for text in document sections
 * @param {string} query - Search query
 * @param {Array} sections - Document sections to search
 * @returns {Array} Matching sections
 */
export const searchDocument = (query, sections) => {
  if (!query || !query.trim() || !sections || !Array.isArray(sections)) {
    return [];
  }

  const results = [];
  const lowerQuery = query.toLowerCase();

  const searchInSections = (sections) => {
    sections.forEach(section => {
      if (section.title.toLowerCase().includes(lowerQuery) ||
          section.content.toLowerCase().includes(lowerQuery)) {
        results.push(section);
      }
      if (section.subsections && section.subsections.length > 0) {
        searchInSections(section.subsections);
      }
    });
  };

  searchInSections(sections);
  return results;
};

export default {
  flattenSections,
  findSectionById,
  getBreadcrumbs,
  calculateProgress,
  searchDocument
};