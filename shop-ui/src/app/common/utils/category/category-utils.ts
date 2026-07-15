import {CategoryResponseDto} from '../../../services/models/category-response-dto';

// Returns leaf categories and handles empty category
export function getLeafCategories(category: CategoryResponseDto): CategoryResponseDto[] {
  const subcategories: CategoryResponseDto[] | undefined = category.subcategories;

  if (subcategories === undefined || subcategories.length === 0) {
    return category.id !== undefined
      ? [category] // Leaf category returns single element array
      : []; // Empty category returns empty array
  }

  return subcategories
    .flatMap((subcategory: CategoryResponseDto): CategoryResponseDto[] => getLeafCategories(subcategory));
}

export function categoriesToIds(categories: CategoryResponseDto[]): number[] {
  return categories
    .map((category: CategoryResponseDto): number => category.id!);
}

export function isLeafCategory(category: CategoryResponseDto, rootCategory: CategoryResponseDto): boolean {
  return getLeafCategories(rootCategory).includes(category);
}

export function flattenCategory(category: CategoryResponseDto): CategoryResponseDto[] {
  const flattenedCategory: CategoryResponseDto[] = [category];
  const subcategories: CategoryResponseDto[] | undefined = category.subcategories;

  if (subcategories !== undefined && subcategories.length > 0) {
    subcategories
      .forEach((category: CategoryResponseDto): void => {
        flattenedCategory.push(...flattenCategory(category));
      });
  }

  return flattenedCategory;
}

export function findCategory(categoryToFind: CategoryResponseDto, rootCategory: CategoryResponseDto): CategoryResponseDto | undefined {
  return flattenCategory(rootCategory)
    .find((category: CategoryResponseDto): boolean => category.id! === categoryToFind.id!);
}

export function getCategoryDepth(category: CategoryResponseDto, depth: number = 0): number {
  const subcategories: CategoryResponseDto[] | undefined = category.subcategories;
  if (subcategories === undefined || subcategories.length === 0) return depth;

  // Category with subcategories uses reduce() to get its depth
  return subcategories
    .reduce((highestDepth: number, category: CategoryResponseDto): number => {
      // Leaf category depth (recursive call when it is not leaf node)
      const currentDepth: number = getCategoryDepth(category, depth + 1);

      return currentDepth > highestDepth
        ? currentDepth
        : highestDepth
    }, 0)
}
// FIXME DONE
