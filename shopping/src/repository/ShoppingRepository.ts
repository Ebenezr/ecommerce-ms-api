import { DB } from '../db/db.connetion';
import { cartItems } from '../db/schema';

export class ShoppingRepository {
  db = {};

  async createCart(input: any) {
    return await DB.insert(cartItems).values(input).execute();
  }
}

// .returing({cartIs:cartItems.id})
