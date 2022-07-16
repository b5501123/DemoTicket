export class VerifyRegister {
  testItem = '';
  CONST_FIRST_NAME = 'FirstName';
  CONST_LAST_NAME = 'LastName';
  CONST_DISPLAY_NAME = 'DisplayName';
  CONST_PASSWORD = 'Password';
  CONST_EMAIL = 'Email';
  passwordValidConfig = {
    minCharacters: 8,
    noSpace: true,
  };

  constructor(_passwordValidConfig = {}) {
    this.testItem = '';
    Object.assign(this.passwordValidConfig, _passwordValidConfig);
  }

  regexNameWarning(str) {
    return /\\\/\*#\$/.test(str);
  }
  regexEmailWarning(str) {
    // eslint-disable-next-line no-useless-escape
    return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
      str,
    );
  }

  checkFirstName(str): boolean {
    this.testItem = this.CONST_FIRST_NAME;
    return !(str.trim() == '' || str.length > 50 || this.regexNameWarning(str));
  }
  checkLastName(str): boolean {
    this.testItem = this.CONST_LAST_NAME;
    return !(str.trim() == '' || str.length > 50 || this.regexNameWarning(str));
  }
  checkDisplayName(str): boolean {
    this.testItem = this.CONST_DISPLAY_NAME;
    return !(str.trim() == '' || str.length > 50 || this.regexNameWarning(str));
  }
  checkEmail(str): boolean {
    this.testItem = this.CONST_EMAIL;
    return this.regexEmailWarning(str);
  }
  checkPassword(str): boolean {
    this.testItem = this.CONST_PASSWORD;
    return (
      this.validPasswordCharacters(str) &&
      this.validPasswordUppercase(str) &&
      this.validPasswordLowercase(str) &&
      this.validPasswordNumber(str) &&
      this.validPasswordSymbol(str) &&
      this.validPasswordSpaces(str)
    );
  }
  clearTestItem() {
    this.testItem = '';
    return this;
  }
  getValidFailedItem(fn, str) {
    if (this.testItem != '') return this;
    if (typeof fn == 'string') fn = this[fn].bind(this);
    const res = fn(str);
    if (res) this.testItem = '';
    return this;
  }
  endValidFailed() {
    return this.testItem;
  }
  testPasswordResult(str) {
    return {
      config: Object.assign({}, this.passwordValidConfig),
      characters: this.validPasswordCharacters(str),
      uppercase: this.validPasswordUppercase(str),
      lowercase: this.validPasswordLowercase(str),
      number: this.validPasswordNumber(str),
      symbol: this.validPasswordSymbol(str),
      spaces: this.validPasswordSpaces(str),
    };
  }
  validPasswordCharacters(str) {
    const len = this.passwordValidConfig.minCharacters || 0;
    return str.length >= len;
  }
  validPasswordUppercase(str) {
    return /[A-Z]/.test(str);
  }
  validPasswordLowercase(str) {
    return /[a-z]/.test(str);
  }
  validPasswordNumber(str) {
    return /[0-9]/.test(str);
  }
  validPasswordSymbol(str) {
    return /(?=.*[!@#$%^&*.\-_])/.test(str);
  }
  validPasswordSpaces(str) {
    if (!this.passwordValidConfig.noSpace) return true;
    return !/\s/.test(str);
  }
}
