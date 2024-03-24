import logMessages from '../utils/logMessages';
import {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from '../utils';

class CustomerServices {
  // async AddNewAddress(_id, userInputs) {
  //   const { street, postalCode, city, country } = userInputs;
  //   return this.repository.CreateAddress({
  //     _id,
  //     street,
  //     postalCode,
  //     city,
  //     country,
  //   });
  // }
  // async GetProfile(id) {
  //   return this.repository.FindCustomerById({ id });
  // }
  // async DeleteProfile(userId) {
  //   const data = await this.repository.DeleteCustomerById(userId);
  //   const payload = {
  //     event: 'DELETE_PROFILE',
  //     data: { userId },
  //   };
  //   return { data, payload };
  // }
}

export default CustomerServices;
