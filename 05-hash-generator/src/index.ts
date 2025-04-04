import { HashGenerator } from './HashGenerator';

const hashGenerator = HashGenerator.createHashGenerator('testSalt123');
const hash = hashGenerator.generateHash('randomInput123');
console.log(hash);
