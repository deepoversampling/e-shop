import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTemplateListComponent } from './category-template-list.component';

describe('CategoryTemplateListComponent', () => {
  let component: CategoryTemplateListComponent;
  let fixture: ComponentFixture<CategoryTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTemplateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
