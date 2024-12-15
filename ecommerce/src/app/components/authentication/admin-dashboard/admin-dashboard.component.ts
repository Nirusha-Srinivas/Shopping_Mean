import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { AddProductDialogComponent } from '../../adminpanel/add-products/add-products.component';
import { AdminPanelSService } from '../../adminpanel/adminpanel.service';
import { environment } from 'environment';
// import { ProductService } from '../../../core/services/product.service';
// import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  stock: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
private imgURL = `${environment.imgURL}`;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private productService: AdminPanelSService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: any) => {
        const backendBaseUrl = this.imgURL; 
        this.products = (Array.isArray(products) ? products : products['products']).map((product: Product) => ({
          ...product,
          imageUrl: product.imageUrl ? `${backendBaseUrl}${product.imageUrl}` : 'path/to/default-image.jpg' // Handle missing image case
        }));
        console.log("products",this.products)
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading products. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
        this.isLoading = false;
      }
    });
  }
  

  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      height:'800px',
      position: { right: '0' },
      panelClass: 'right-sidebar-dialog',
      autoFocus: false,
      hasBackdrop: true,
     
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '400px',
      height:'800px',
      position: { right: '0' },
      panelClass: 'right-sidebar-dialog',
      autoFocus: false,
      hasBackdrop: true,
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
            verticalPosition: 'top'
          });
          this.loadProducts(); // Refresh the product list
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open(
            error.error.message || 'Error deleting product. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: 'snackbar-error',
            verticalPosition: 'top'

            }
          );
        },
      });
    }
  }
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}