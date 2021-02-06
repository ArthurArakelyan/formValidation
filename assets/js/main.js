const wrapper = document.querySelector('.wrapper');
const form = document.querySelector('.home__form');

function createInput(elem = form, classNames = ['form__input']) {
  return function(placeholder = '', name = '', value = '', onInput = () => {}) {
    const input = elem.appendChild(document.createElement('input'));
    classNames.map(className => {
      input.classList.add(className);
    });
    input.value = value;
    input.placeholder =  placeholder;
    input.name = name;
    input.type = 'text';
    input.required = true;

    input.addEventListener('input', onInput);
  
    return input;
  }
}

// steps

const DEFAULT_STEP = 1;
const steps = 3;
let step = DEFAULT_STEP;

if(!localStorage.getItem('step')) {
  localStorage.setItem('step', step);
} else {
  if(Number(localStorage.getItem('step')) > 0 && Number(localStorage.getItem('step')) <= 3) {
    step = Number(localStorage.getItem('step'));
  } else {
    localStorage.setItem('step', step);
    step = DEFAULT_STEP;
  }
}

const stepNow = document.querySelector('.step_now');
stepNow.innerHTML = step;

const allSteps = document.querySelector('.all__steps');
allSteps.innerHTML = steps;

function stepChange(newStep) {
  step = newStep;
  stepNow.innerHTML = step;
  localStorage.setItem('step', step);
}

// form data

let data = {
  user: {
    firstName: {
      value: '',
      valid: false
    },
    lastName: {
      value: '',
      valid: false
    },
    country: {
      value: '',
      valid: false
    },
    city: {
      value: '',
      valid: false
    },
    address: {
      value: '',
      valid: false
    },
    postalCode: {
      value: '',
      valid: false
    }
  },
  userAccount: {
    email: {
      value: '',
      valid: false
    },
    password: {
      value: '',
      valid: false
    },
    repeatedPassword: {
      value: '',
      valid: false
    },
    package: 'standard'
  },
  userCard: {
    visa: {
      value: '',
      valid: false
    },
    fullName: {
      value: '',
      valid: false
    },
    cvc: {
      value: '',
      valid: false
    },
    date: {
      month: '',
      year: '',
      monthValid: false,
      yearValid: false
    }
  }
}

if(!localStorage.getItem('data')) {
  localStorage.setItem('data', JSON.stringify(data));
} else {
  data = JSON.parse(localStorage.getItem('data'));
}

// form render

function formRerender() {
  if(step > 0 && step <= 3) {
    const {user, userAccount, userCard} = data;
    document.querySelector('.home__form').remove();
    const newForm = wrapper.appendChild(document.createElement('form'));
    newForm.classList.add('home__form');

    function checkNameValidOnInput(input, value, valid, boolean = value.trim() && value.length > 3) {
      if(boolean) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        valid = true;
      } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        valid = false;
      }

      return valid;
    }

    function checkNameValid(input, value, valid, boolean) {
      if(value) {
        checkNameValidOnInput(input, value, valid, boolean);
      }
    }

    function onSubmit(e) {
      e.preventDefault();
      if(step === 1 && user) {
        const {firstName, lastName, country, city, address, postalCode} = user;

        if(firstName.valid && lastName.valid && country.valid && city.valid && address.valid && postalCode.valid) {
          stepChange(++step);
          formRerender();
        }
      } else if(step === 2 && userAccount) {
        const {email, password, repeatedPassword, package} = userAccount;

        if(email.valid && password.valid && repeatedPassword.valid && package) {
          stepChange(++step);
          formRerender();
        }
      } else if(step === 3 && userCard) {
        const {visa, fullName, cvc, date} = userCard;

        if(visa.valid && fullName.valid && cvc.valid && date.monthValid && date.yearValid) {
          alert('Confirmed, see data in console');
          console.log(data);
        }
      }
    }

    function onPrevious() {
      stepChange(--step);
      formRerender();
    }

    const regexp = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

    if(step === 1) {
      const firstNameInput = createInput(newForm)('First Name', 'firstName', user.firstName.value, (e) => {
        if(e.target.value.match(regexp) === false) {
          e.target.value = user.firstName.value;
        }
        user.firstName.value = e.target.value;
        const valid = checkNameValidOnInput(
          firstNameInput,
          e.target.value,
          e.target.value.match(regexp),
          e.target.value.match(regexp)
        );
        user.firstName.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      firstNameInput.minLength = 4;
      checkNameValid(
        firstNameInput,
        user.firstName.value,
        user.firstName.valid,
        user.firstName.value.match(regexp)
      );

      const lastNameInput = createInput(newForm)('Last Name', 'lastName', user.lastName.value, (e) => {
        if(e.target.value.match(regexp) === false) {
          e.target.value = user.lastName.value;
        }
        user.lastName.value = e.target.value;
        const valid = checkNameValidOnInput(
          lastNameInput,
          e.target.value,
          e.target.value.match(regexp),
          e.target.value.match(regexp)
        );
        user.lastName.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      lastNameInput.minLength = 4;
      checkNameValid(
        lastNameInput,
        user.lastName.value,
        user.lastName.valid,
        user.lastName.value.match(regexp)
      );

      const countries = [
        'Choose your country',
        'Armenia',
        'Russia',
        'England',
        'France'
      ];

      const countrySelect = newForm.appendChild(document.createElement('select'));
      countrySelect.classList.add('form__input');
      countrySelect.name = 'country';
      countrySelect.dataset.value = user.country.value;
      countrySelect.required = true;
      if(countrySelect.dataset.value) {
        countrySelect.classList.add('valid');
        countrySelect.classList.remove('invalid');
      }

      countries.map(country => {
        const countryOption = countrySelect.appendChild(document.createElement('option'));
        countryOption.value = country;
        countryOption.innerHTML = country;
        if(country === user.country.value) {
          countryOption.selected = true;
        }
      });

      countrySelect.addEventListener('change', (e) => {
        if(e.target.value !== 'Choose your country') {
          countrySelect.dataset.value = e.target.value;
          user.country.value = e.target.value;
          user.country.valid = true;
          localStorage.setItem('data', JSON.stringify(data));
          countrySelect.classList.add('valid');
          countrySelect.classList.remove('invalid');
        } else {
          countrySelect.dataset.value = '';
          user.country.value = '';
          user.country.valid = false;
          localStorage.setItem('data', JSON.stringify(data));
          countrySelect.classList.remove('valid');
          countrySelect.classList.add('invalid');
        }
      });

      const cityInput = createInput(newForm)('City', 'city', user.city.value, (e) => {
        user.city.value = e.target.value;
        const valid = checkNameValidOnInput(
          cityInput,
          e.target.value,
          e.target.value.length > 1,
          e.target.value.length > 1
        );
        user.city.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      checkNameValid(
        cityInput,
        user.city.value,
        user.city.valid,
        user.city.value.length > 1
      );

      const addressInput = createInput(newForm)('Address', 'address', user.address.value, (e) => {
        user.address.value = e.target.value;
        const valid = checkNameValidOnInput(
          addressInput,
          e.target.value,
          e.target.value.length > 1,
          e.target.value.length > 1
        );
        user.address.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      checkNameValid(
        addressInput,
        user.address.value,
        user.address.valid,
        user.address.value.length > 1
      );

      const postalCodeInput = createInput(newForm)('Postal code', 'postalCode', user.postalCode.value, (e) => {
        user.postalCode.value = e.target.value;
        const valid = checkNameValidOnInput(
          postalCodeInput,
          e.target.value,
          e.target.value.length > 0 && e.target.value.length <= 4,
          e.target.value.length > 0 && e.target.value.length <= 4
        );
        user.postalCode.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      postalCodeInput.type = 'number';
      postalCodeInput.maxLength = 4;
      checkNameValid(
        postalCodeInput,
        user.postalCode.value,
        user.postalCode.valid,
        user.postalCode.value.length > 0 && user.postalCode.value.length <= 4
      );
    } else if(step === 2) {
      const emailInput = createInput(newForm)('Email', 'email', userAccount.email.value, (e) => {
        userAccount.email.value = e.target.value;
        const valid = checkNameValidOnInput(
          emailInput,
          e.target.value,
          e.target.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
          e.target.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        );
        userAccount.email.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      emailInput.type = 'email';
      checkNameValid(
        emailInput,
        userAccount.email.value,
        userAccount.email.valid,
        userAccount.email.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      );

      const passwordInput = createInput(newForm)('Password', 'password', userAccount.password.value, (e) => {
        userAccount.password.value = e.target.value;
        const valid = checkNameValidOnInput(
          passwordInput,
          e.target.value,
          e.target.value.length >= 7,
          e.target.value.length >= 7
        );
        userAccount.password.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      passwordInput.type = 'password';
      passwordInput.minLength = 7;
      checkNameValid(
        passwordInput,
        userAccount.password.value,
        userAccount.password.valid,
        userAccount.password.value.length >= 7
      );

      const repeatPassword = createInput(newForm)('Repeat password', 'repeatPassword', userAccount.repeatedPassword.value, (e) => {
        userAccount.repeatedPassword.value = e.target.value;
        const valid = checkNameValidOnInput(
          repeatPassword,
          e.target.value,
          e.target.value === userAccount.password.value,
          e.target.value === userAccount.password.value
        );
        userAccount.repeatedPassword.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      repeatPassword.type = 'password';
      repeatPassword.minLength = 7;
      checkNameValid(
        repeatPassword,
        userAccount.repeatedPassword.value,
        userAccount.repeatedPassword.valid,
        userAccount.repeatedPassword.value === userAccount.password.value
      );

      passwordInput.addEventListener('input', (e) => {
        const valid = checkNameValidOnInput(
          repeatPassword,
          e.target.value,
          e.target.value === userAccount.repeatedPassword.value,
          e.target.value === userAccount.repeatedPassword.value
        );

        userAccount.repeatedPassword.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });

      const packages = newForm.appendChild(document.createElement('div'));
      packages.classList.add('form__radios');

      const standardPackage = packages.appendChild(document.createElement('div'));
      standardPackage.classList.add('form__radio_container');

      const standardPackageInput = standardPackage.appendChild(document.createElement('input'));
      standardPackageInput.classList.add('form__radio');
      standardPackageInput.type = 'radio';
      standardPackageInput.id = 'standard';

      const standardPackageLabel = standardPackage.appendChild(document.createElement('label'));
      standardPackageLabel.classList.add('form__radio_label');
      standardPackageLabel.innerHTML = 'Standard Package';
      standardPackageLabel.setAttribute('for', 'standard');


      const premiumPackage = packages.appendChild(document.createElement('div'));
      premiumPackage.classList.add('form__radio_container');

      const premiumPackageInput = premiumPackage.appendChild(document.createElement('input'));
      premiumPackageInput.classList.add('form__radio');
      premiumPackageInput.type = 'radio';
      premiumPackageInput.id = 'premium';

      const premiumPackageLabel = premiumPackage.appendChild(document.createElement('label'));
      premiumPackageLabel.classList.add('form__radio_label');
      premiumPackageLabel.innerHTML = 'Premium Package';
      premiumPackageLabel.setAttribute('for', 'premium');

      if(userAccount.package) {
        if(userAccount.package === standardPackageInput.id) {
          standardPackageInput.checked = true;
        } else {
          premiumPackageInput.checked = true;
        }
      }

      standardPackageInput.addEventListener('click', (e) => {
        userAccount.package = e.target.id;
        localStorage.setItem('data', JSON.stringify(data));
        if(userAccount.package !== premiumPackageInput.id) {
          premiumPackageInput.checked = false;
        }
      });
      premiumPackageInput.addEventListener('click', (e) => {
        userAccount.package = e.target.id;
        localStorage.setItem('data', JSON.stringify(data));
        if(userAccount.package !== standardPackageInput.id) {
          standardPackageInput.checked = false;
        }
      });

    } else if(step === 3) {
      const visaInput = createInput(newForm)('4345 3454 3543 4345', 'visa', userCard.visa.value, (e) => {
        if(isNaN(Number(e.target.value))) {
          e.target.value = userCard.visa.value;
        }
        userCard.visa.value = e.target.value;
        const valid = checkNameValidOnInput(
          visaInput,
          e.target.value,
          e.target.value.length === 16,
          e.target.value.length === 16
        );
        userCard.visa.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      visaInput.minLength = 16;
      visaInput.maxLength = 16;
      checkNameValid(
        visaInput,
        userCard.visa.value,
        userCard.visa.valid,
        userCard.visa.value.length === 16
      );

      const fullNameInput = createInput(newForm)('Full Name', 'fullName', userCard.fullName.value, (e) => {
        if(e.target.value.match(regexp) === false) {
          e.target.value = userCard.fullName.value;
        }
        userCard.fullName.value = e.target.value;
        const valid = checkNameValidOnInput(
          fullNameInput,
          e.target.value,
          e.target.value.length <= 100 && e.target.value.match(regexp),
          e.target.value.length <= 100 && e.target.value.match(regexp)
        );
        userCard.fullName.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      fullNameInput.maxLength = 100;
      checkNameValid(
        fullNameInput,
        userCard.fullName.value,
        userCard.fullName.valid,
        userCard.fullName.value.length <= 100 && userCard.fullName.value.match(regexp)
      );

      const cvcInput = createInput(newForm)('CVC 1234', 'cvc', userCard.cvc.value, (e) => {
        if(e.target.value.length > 4) {
          e.target.value = e.target.value.slice(0, 4);
        }
        userCard.cvc.value = e.target.value;
        const valid = checkNameValidOnInput(
          cvcInput,
          e.target.value,
          e.target.value.length === 4,
          e.target.value.length === 4
        );
        userCard.cvc.valid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      cvcInput.type = 'number';
      cvcInput.minLength = 4;
      cvcInput.maxLength = 4;
      checkNameValid(
        cvcInput,
        userCard.cvc.value,
        userCard.cvc.valid,
        userCard.cvc.value.length === 4
      );
      
      const dateInputs = newForm.appendChild(document.createElement('div'));
      dateInputs.classList.add('form__date_inputs');

      const monthInput = createInput(dateInputs, ['form__input', 'form__date_input'])('MM', 'cardMonth', userCard.date.month, (e) => {
        if(e.target.value.length > 2) {
          e.target.value = e.target.value.slice(0, 2);
        }
        if(Number(e.target.value) > 12) {
          e.target.value = '';
        }
        userCard.date.month = e.target.value;
        const valid = checkNameValidOnInput(
          monthInput,
          e.target.value,
          e.target.value.length === 2,
          e.target.value.length === 2
        );
        userCard.date.monthValid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      monthInput.type = 'number';
      monthInput.maxLength = 2;
      monthInput.minLength = 2;
      checkNameValid(
        monthInput,
        userCard.date.month,
        userCard.date.monthValid,
        userCard.date.month.length === 2
      );

      const date = new Date();
      const yearInput = createInput(dateInputs, ['form__input', 'form__date_input'])('YY', 'cardYear', userCard.date.year, (e) => {
        if(e.target.value.length > 2) {
          e.target.value = e.target.value.slice(0, 2);
        }
        userCard.date.year = e.target.value;
        const valid = checkNameValidOnInput(
          yearInput,
          e.target.value,
          e.target.value.length === 2 && e.target.value >= Number(date.getFullYear().toString().substr(-2)),
          e.target.value.length === 2 && e.target.value >= Number(date.getFullYear().toString().substr(-2))
        );
        userCard.date.yearValid = valid;
        localStorage.setItem('data', JSON.stringify(data));
      });
      yearInput.type = 'number';
      yearInput.maxLength = 2;
      yearInput.minLength = 2;
      checkNameValid(
        yearInput,
        userCard.date.year,
        userCard.date.yearValid,
        userCard.date.year.length === 2 && userCard.date.year >= Number(date.getFullYear().toString().substr(-2))
      );
    } else {
      stepChange(1);
      formRerender();
      return;
    }

    const stepButtons = newForm.appendChild(document.createElement('div'));
    stepButtons.classList.add('form__step_buttons');

    if(step > 1) {
      const previousStepButton = stepButtons.appendChild(document.createElement('button'));
      previousStepButton.classList.add('form__step_button');
      previousStepButton.innerHTML = 'Previous';
      previousStepButton.type = 'button';
      previousStepButton.addEventListener('click', onPrevious);
    }

    if(step < 3) {
      const nextStepButton = stepButtons.appendChild(document.createElement('button'));
      nextStepButton.classList.add('form__step_button');
      nextStepButton.innerHTML = 'Next';
      newForm.addEventListener('submit', onSubmit);
    }

    if(step === 3) {
      const confirmButton = stepButtons.appendChild(document.createElement('button'));
      confirmButton.classList.add('form__step_button');
      confirmButton.innerHTML = 'Confirm';
      newForm.addEventListener('submit', onSubmit);
    }
  } else {
    stepChange(1);
    formRerender();
  }
}

window.addEventListener('load', () => {
  formRerender();
});
