import { Injectable } from '@angular/core';
import {CategoryResponseDto} from '../../../services/models/category-response-dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryColorizeService { // FIXME DONE
  public hueStart: number = 0;
  public hueEnd: number = 0;
  public hueStep: number = 0;
  private readonly _saturation: number = 80;
  private readonly _lightness: number = 55;

  // 0 - red, 40 - yellow
  public colorize(category: CategoryResponseDto, hueStart: number = 0, hueEnd: number = 40): CategoryResponseDto {
    this.hueStart = hueStart;
    this.hueEnd = hueEnd;

    // Neither empty category nor root category compute a hue step
    if (category.subcategories !== undefined) {
      this.hueStep = (this.hueEnd - this.hueStart) / Math.max(category.subcategories.length - 1, 1); // Prevents dividing by 0
    }
    this.colorizeCategory(category);

    return category;
  }

  // Recursively initializes color property for categories
  // Root category uses color-dodger-blue, first-level children compute their own, deeper levels inherit
  // Empty category will have the color set
  public colorizeCategory(category: CategoryResponseDto, depth: number = 1, hue: number = 0): void {
    if (depth === 1) {
      category.color = '#1E90FFFF';
    } else {
      category.color = `hsl(${hue}, ${this._saturation}%, ${this._lightness}%)`;
    }

    const subcategories: CategoryResponseDto[] | undefined = category.subcategories;
    if (subcategories === undefined || subcategories.length === 0) return;

    for (let i: number = 0; i < subcategories.length; i++) {
      // Only first generation of children has the hue calculated, all others inherit it
      const childHue: number = depth === 1
        ? this.hueStart + i * this.hueStep
        : hue;

      this.colorizeCategory(subcategories[i], depth + 1, childHue);
    }
  }

}
