// premium-boutiques.component.ts
import { Component } from '@angular/core';

interface BoutiqueCard {
  imageUrl: string;
  title: string;
  discount: string;
  link: string;
}

@Component({
  selector: 'app-premium-boutiques',
  templateUrl: './premium-boutiques.component.html',
  styleUrls: ['./premium-boutiques.component.css']
})
export class PremiumBoutiquesComponent {
  boutiqueCards: BoutiqueCard[] = [
    {
      imageUrl: 'assets/premium/premium-1.jpg/',
      title: 'Mom of All Sales',
      discount: 'UPTO 60% Off',
      link: '/mom-sale'
    },
    {
      imageUrl: 'assets/premium/premium-2.jpg/',
      title: 'Merry Christmas',
      discount: 'FLAT 40% OFF',
      link: '/christmas-sale'
    },
    {
      imageUrl: 'assets/premium/premium-3.jpg/',
      title: 'The Wedding Store',
      discount: 'Flat 45% OFF',
      link: '/wedding-store'
    },
    {
      imageUrl: 'assets/premium/premium-1.jpg/',
      title: 'Mom of All Sales',
      discount: 'UPTO 60% Off',
      link: '/mom-sale'
    },
    {
      imageUrl: 'assets/premium/premium-2.jpg/',
      title: 'Merry Christmas',
      discount: 'FLAT 40% OFF',
      link: '/christmas-sale'
    },
    {
      imageUrl: 'assets/premium/premium-3.jpg/',
      title: 'The Wedding Store',
      discount: 'Flat 45% OFF',
      link: '/wedding-store'
    }
  ];
}