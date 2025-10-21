// src/services/ProductService.ts
import { Result } from "../types/Types";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  inStock: boolean;
};

export class ProductService {
  /**
   * Test N°1
   * Trie les produits par prix croissant.
   * Retourne une nouvelle liste triée, sans modifier l’originale.
   */
  static sortByPrice(products: Product[]): Product[] {
    return [...products].sort(
      (productA, productB) => productA.price - productB.price
    );
  }

  /**
   * Test N°2
   * Trie les produits par note (rating) décroissante,
   * puis par nom alphabétique en cas d’égalité.
   */
  static sortByRating(products: Product[]): Product[] {
    return [...products].sort((productA, productB) => {
      if (productB.rating === productA.rating) {
        return productA.name.localeCompare(productB.name);
      }
      return productB.rating - productA.rating;
    });
  }

  /**
   * Test N°3
   * Trie les produits par catégorie alphabétique,
   * puis par disponibilité (en stock d’abord),
   * et enfin par prix croissant.
   */
  static sortByCategoryAndStock(products: Product[]): Result<Product[], null> {
    if (!products.length) {
      return { success: false, message: "Aucun produit à trier" };
    }

    const sorted = [...products].sort((productA, productB) => {
      if (productA.category !== productB.category) {
        return productA.category.localeCompare(productB.category);
      }
      if (productA.inStock !== productB.inStock) {
        return productA.inStock ? -1 : 1;
      }
      return productA.price - productB.price;
    });

    return { success: true, data: sorted };
  }
}
