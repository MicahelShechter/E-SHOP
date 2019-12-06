import { Component, OnInit , Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProductService} from '../../services/product.service';
import {CategoryService} from '../../services/category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit {
  addProductForm: FormGroup;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', Validators.required],
      imageURL: ['', Validators.required]
    });
  }
  save() {
   console.log(`save function called`);
   const newProductData = this.addProductForm.getRawValue();
   const newProduct = {
     name: newProductData.name,
     categoryId: newProductData.categoryId,
     price: newProductData.price,
     imageURL: newProductData.imageURL
   };
   this.productService.addProduct(newProduct).subscribe(data => {
     this.dialogRef.close(data);
   });
  }

}
