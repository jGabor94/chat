export const signupValidationSchema = {
    username: {
        isLength: {
            options: {min: 3},
            errorMessage: 'felhasználónévnek minimum 3 karakterből kell állnia'
        }
    },
    password: {
        isStrongPassword: {
            options: {minLength: 8, minLowercase: 1, minUppercase: 1, returnScore: false, minNumbers: 1, minSymbols: 0, pointsPerUnique: 0, pointsPerRepeat: 0, pointsForContainingLower: 0, pointsForContainingUpper: 0, pointsForContainingNumber: 0, pointsForContainingSymbol: 0 },
            errorMessage: 'a jelszónak minimum 8 karakterből kell állnia, tartalmaznia kell kis és nagy betűt valamint számot'
        }
    },
    confirmPassword: {
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('A megerőstő jelszó nem egyezik');
                  }
                return true
            },
          },
    },
    email: {
        isEmail: true,
        errorMessage: 'helytelenül adtad meg az E-mail címed'
        },
    agreement: {
        custom: {
            options: (value) => {
                if (value != "true") {
                    throw new Error('Fogadd el a felhasználói feltételeket');
                  }
                return true
            },
          },
    }
    
    
}

export const emailValidationSchema = {
    email: {
        isEmail: true,
        errorMessage: 'helytelenül adtad meg az E-mail címed'
        },
}

export const passwordValidationSchema = {
    password: {
        isStrongPassword: {
            options: {minLength: 8, minLowercase: 1, minUppercase: 1, returnScore: false, minNumbers: 1, minSymbols: 0, pointsPerUnique: 0, pointsPerRepeat: 0, pointsForContainingLower: 0, pointsForContainingUpper: 0, pointsForContainingNumber: 0, pointsForContainingSymbol: 0 },
            errorMessage: 'a jelszónak minimum 8 karakterből kell állnia, tartalmaznia kell kis és nagy betűt valamint számot'
        }
    },
    confirmPassword: {
        custom: {
            options: (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('A megerőstő jelszó nem egyezik');
                  }
                return true
            },
          },
    },
}