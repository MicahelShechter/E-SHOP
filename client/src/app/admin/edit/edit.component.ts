import { Component, OnInit , Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  editProductForm: FormGroup;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.editProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', Validators.required],
      imageURL: ['', Validators.required]
    });
    const editForm = this.editProductForm.controls;
    const preEditFields = this.data.preEditFields;

    editForm.categoryId.setValue(preEditFields.categoryId);
    editForm.name.setValue(preEditFields.name);
    editForm.price.setValue(preEditFields.price);
    editForm.imageURL.setValue(preEditFields.imageURL);
  }

  save(productId) {
    const newFormValues = this.editProductForm.getRawValue();
    console.log(newFormValues);
    const editedProduct = {
      name: newFormValues.name.toLowerCase(),
      categoryId: newFormValues.categoryId,
      price: newFormValues.price,
      imageURL: newFormValues.imageURL
    };
    this.productService.editProduct(productId, editedProduct).subscribe(data => {
      this.dialogRef.close(data);
    });
  }
}
