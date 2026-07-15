import {Component, input, InputSignal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CategoryTemplateDraftCache} from '../../../../../../services/models/category-template-draft-cache';
import {PropertyComponent} from '../property/property.component';
import {PropertyResponseDto} from '../../../../../../services/models/property-response-dto';
import {ResourcesInitService} from '../../../../../../services/resources-init/resources-init.service';
import {ErrorHandlerService} from '../../../../../../services/error-handler/error-handler.service';
import {
  CategoryTemplateControllerService
} from '../../../../../../services/services/category-template-controller.service';
import {
  CategoryTemplatesInitService
} from '../../../../../../services/admin/category-templates-init/category-templates-init.service';
import {PropertiesInitService} from '../../../../../../services/admin/properties-init/properties-init.service';
import {StrictHttpResponse} from '../../../../../../services/strict-http-response';
import {CategoryTemplateResponseDto} from '../../../../../../services/models/category-template-response-dto';
import {getLocation} from '../../../../../../common/utils/utils';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-create-category-template',
  imports: [
    FormsModule,
    PropertyComponent
  ],
  templateUrl: './create-category-template.component.html',
  styleUrl: './create-category-template.component.scss'
})
export class CreateCategoryTemplateComponent { // FIXME DONE
  public readonly categoryId: InputSignal<number> = input.required<number>();
  public readonly categoryTemplateDraftCache: InputSignal<CategoryTemplateDraftCache> = input.required<CategoryTemplateDraftCache>();

  constructor(
    private readonly _resourcesInitService: ResourcesInitService,
    private readonly _propertiesInitService: PropertiesInitService,
    private readonly _categoryTemplateControllerService: CategoryTemplateControllerService,
    private readonly _categoryTemplatesInitService: CategoryTemplatesInitService,
    private readonly _errorHandlerService: ErrorHandlerService,
    private readonly _toastrService: ToastrService
  ) {}

  protected get property(): PropertyResponseDto | null {
    return this.categoryTemplateDraftCache().property;
  }

  protected set property(property: PropertyResponseDto | null) {
    this.categoryTemplateDraftCache().property = property;
  }

  protected get properties(): PropertyResponseDto[] {
    return this.categoryTemplateDraftCache().properties;
  }

  protected get hasProperties(): boolean {
    return this.categoryTemplateDraftCache().properties.length > 0;
  }

  protected get hasProperty(): boolean {
    return this.categoryTemplateDraftCache().property !== null;
  }

  protected get allProperties(): PropertyResponseDto[] {
    return Object.values(this._propertiesInitService.properties());
  }

  protected removeProperty(propertyToRemove: PropertyResponseDto): void {
    const index: number = this.properties.findIndex((property: PropertyResponseDto): boolean => property === propertyToRemove);
    if (index !== -1) {
      this.properties.splice(index, 1);
    }
  }

  protected get propertyAlreadyExists(): boolean {
    const properties: PropertyResponseDto[] = this.categoryTemplateDraftCache().properties;
    const property: PropertyResponseDto | null = this.categoryTemplateDraftCache().property!;

    return properties.includes(property);
  }

  public get categoryTemplateResizeTrigger(): boolean {
    return this._categoryTemplatesInitService.getCategoryTemplateResizeTrigger(this.categoryId());
  }

  public set categoryTemplateResizeTrigger(state: boolean) {
    this._categoryTemplatesInitService.setCategoryTemplateResizeTrigger(this.categoryId(), state);
  }

  protected addProperty(): void {
    if (this.property === null) return;

    this.properties.push(this.property);
    this.categoryTemplateResizeTrigger = !this.categoryTemplateResizeTrigger;
    this.property = null;
  }

  protected cancel(): void {
    this._categoryTemplatesInitService.clearCategoryTemplateDraftCache(this.categoryId());
  }

  protected createCategoryTemplate(): void {
    const categoryId: number = this.categoryId();
    const propertyIds: number[] = this.categoryTemplateDraftCache().properties
      .map((property: PropertyResponseDto): number => property.id!);

    this._categoryTemplateControllerService.createCategoryTemplate$Response({
      body: {
        categoryId: categoryId,
        propertyIds: propertyIds
      }
    }).subscribe({
      next: async (response: StrictHttpResponse<CategoryTemplateResponseDto>): Promise<void> => {
        await this._resourcesInitService.init();
        this._categoryTemplatesInitService.removeCategoryTemplateStates(this.categoryId());

        this._toastrService.success(
          `Category template for the category with the ID ${response.body.categoryId} has been created`,
          'Success'
        );
        console.log(getLocation(response));
      },
      error: (err: any): void => {
        this._errorHandlerService.handle(err);
      }
    });
  }

}
