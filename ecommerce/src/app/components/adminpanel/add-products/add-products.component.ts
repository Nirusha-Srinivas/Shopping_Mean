import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { ProductService } from '../../../core/services/product.service';
import { AdminPanelSService } from '../adminpanel.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductDialogComponent implements OnInit {
  productForm: FormGroup;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;
  categories = [
    { value: 'GIRLS FASHION', label: 'Girls Fashion' },
    { value: 'BOYS FASHION', label: 'Boys Fashion' },
    { value: 'FOOTWEAR', label: 'Footwear' },
    { value: 'TOYS', label: 'Toys' },
    { value: 'DIAPRING', label: 'Diapering' },
    { value: 'FEEDING', label: 'Feeding' },
    { value: 'BATH', label: 'Bath' },
    { value: 'NURSERY', label: 'Nursery' },
    { value: 'MOMS', label: 'Moms' },
    { value: 'HEALTH', label: 'Health' },
    { value: 'BOUTIQUES', label: 'Boutiques' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productService: AdminPanelSService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: ['', Validators.required]
    });

    if (data?.product) {
      this.productForm.patchValue({
        title: data.product.title,
        description: data.product.description,
        price: data.product.price,
        category: data.product.category,
        stock: data.product.stock
      });
      console.log("data prod",data.product)
      this.imagePreview = data.product.imageUrl;
      console.log("imagepreview ",this.imagePreview)
    }
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File) {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Please select an image file', 'Close', {
        duration: 3000
      });
    }
  }

  onSubmit() {
    console.log(this.productForm.valid, this.selectedFile, "in on submit");
    
    if (this.productForm.valid) {
      this.isSubmitting = true;
  
      const formData = new FormData();
      formData.append('title', this.productForm.get('title')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('stock', this.productForm.get('stock')?.value);
      formData.append('brand', 'Default Brand'); // Add brand if required
  
      // Only append the file if a new one is selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
  
      // Determine whether to create or update the product
      const request = this.data?.product?._id
        ? this.productService.updateProduct(this.data.product._id, formData)
        : this.productService.createProduct(formData);
  
      request.subscribe({
        next: (response) => {
          console.log('Product saved successfully:', response);
          const successMessage =
            this.data?.mode === 'edit'
              ? 'Product updated successfully'
              : 'Product added successfully';
          this.snackBar.open(successMessage, 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            verticalPosition: 'top'
          });
    this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.isSubmitting = false;
          this.snackBar.open(error.error.message || 'Error saving product', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
            verticalPosition: 'top'

          });
        },
      });
    } else {
      // Form validation error
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top'

      });
    }
  }
  

  onClose() {
    this.dialogRef.close();
  }
}