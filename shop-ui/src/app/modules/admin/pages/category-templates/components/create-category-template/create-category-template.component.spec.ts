import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryTemplateComponent } from './create-category-template.component';

describe('CreateCategoryTemplateComponent', () => {
  let component: CreateCategoryTemplateComponent;
  let fixture: ComponentFixture<CreateCategoryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategoryTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategoryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
