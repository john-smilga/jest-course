import { UserService } from './services/01-users/UserService';
//  in name is '' and for all emails that are not 'test@test.com', will throw an error
const main = async () => {
  const input = { name: 'John', email: 'test@test.com' };
  const userService = new UserService(input.name, input.email);
  const result = await userService.registerUser();
};

main();
