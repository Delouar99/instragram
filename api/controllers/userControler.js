import User from "../models/User.js";
import createError from "../utility/ErrorControler.js";
import { hashPassword, passwordVerify } from "../utility/hash.js";
import { getRandom } from "../utility/math.js";
import { forgotPasswordLink, SendEmail } from "../utility/SendEmail.js";
import { SenOTP } from "../utility/Sendsms.js";
import { createToken, tokenVerify } from "../utility/token.js";
import { isEmail, isMobile } from "../utility/validate.js";

/**
 * @access public
 * @route /api/register
 * @mehtod POST
 */

export const register = async (req, res, next) => {
  try {
    //get form data
    const {
      first_name,
      sur_name,
      auth,
      password,
      birth_date,
      birth_month,
      birth_year,
      gender,
    } = req.body;

    //validation
    if (!first_name || !sur_name || !auth || !password || !gender) {
      next(createError(400, "All feilds are required"));
    }

    //initial auth value
    let mobileData = null;
    let emailData = null;

    if (isEmail(auth)) {
      emailData = auth;

      //email check
      const emailCheck = await User.findOne({ email: auth });

      if (emailCheck) {
        return next(createError(400, "Email Already exists"));
      } else {
        let activationCode = getRandom(10000, 99999);

        //check activation code
        const checkCode = await User.findOne({ access_token: activationCode });

        if (checkCode) {
          activationCode = getRandom(10000, 99999);
        }

        const user = await User.create({
          first_name,
          sur_name,
          mobile: mobileData,
          email: emailData,
          password: hashPassword(password),
          gender,
          birth_date,
          birth_month,
          birth_year,
          access_token: activationCode,
        });

        if (user) {
          //create activation token
          const activationToken = createToken({ id: user._id }, "30d");

          //create activation mail
          SendEmail(user.email, {
            name: user.first_name + " " + user.sur_name,
            link: `${process.env.APP_URL}:${process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,

            code: activationCode,
          });

          res
            .status(200)
            .cookie("otp", user.email, {
              expires: new Date(Date.now() + 1000 * 60 * 15),
            })
            .json({
              message: "User create successfully",
              user: user,
            });
        }
      }
    } else if (isMobile(auth)) {
      mobileData = auth;

      //mobile check
      const mobileCheck = await User.findOne({ mobile: auth });

      if (mobileCheck) {
        return next(createError(400, "Mobile Already exists"));
      } else {
        let activationCode = getRandom(10000, 99999);

        //check activation code
        const checkCode = await User.findOne({ access_token: activationCode });

        if (checkCode) {
          activationCode = getRandom(10000, 99999);
        }

        const user = await User.create({
          first_name,
          sur_name,
          mobile: mobileData,
          email: emailData,
          password: hashPassword(password),
          gender,
          birth_date,
          birth_month,
          birth_year,
          access_token: activationCode,
        });

        if (user) {
          //create activation token
          const activationToken = createToken({ id: user._id }, "30d");

          //send otp
          SenOTP(
            user.mobile,
            `HI ${user.first_name} ${user.sur_name}, your activation code is${activationCode}`
          );

          res
            .status(200)
            .cookie("otp", user.mobile, {
              expires: new Date(Date.now() + 1000 * 60 * 15),
            })
            .json({
              message: "User create successfully",
              user: user,
            });
        }
      }
    } else {
      next(createError(400, "Invalid Mobile or Email"));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @route resendActivation
 * @mehtod POST
 */

export const resendActivation = async (req, res, next) => {
  const { email } = req.body;

  try {
    const emailUser = await User.findOne({ email: email }).and([
      { isActivate: false },
    ]);

    //create access token
    let activationCode = getRandom(10000, 99999);

    //check activation code
    const checkCode = await User.findOne({ access_token: activationCode });

    if (checkCode) {
      activationCode = getRandom(10000, 99999);
    }

    //if not user
    if (!emailUser) {
      next(createError(400, "invalid Line request!"));
    }

    if (emailUser) {
      //create activation token
      const activationToken = createToken({ id: emailUser._id }, "30d");

      //create activation mail
      SendEmail(emailUser.email, {
        name: emailUser.first_name + " " + emailUser.sur_name,
        link: `${process.env.APP_URL}:${process.env.SERVER_PORT}/api/v1/user/activate/${activationToken}`,

        code: activationCode,
      });

      //update naw link
      await User.findByIdAndUpdate(emailUser._id, {
        access_token: activationCode,
      });

      res
        .status(200)
        .cookie("otp", emailUser.email, {
          expires: new Date(Date.now() + 1000 * 60 * 15),
        })
        .json({
          message: "Activation link Send",
        });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @route /api/v1/login
 * @mehtod POST
 */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //invalide email
    if (!isEmail(email)) {
      next(createError(400, "Invaild Email Address"));
    }

    //validate
    if (!email || !password) {
      next(createError(400, "All feilds are required"));
    }

    //user valid
    const loginUser = await User.findOne({ email: email });

    if (!loginUser) {
      next(createError(400, "login user not found"));
    } else {
      if (!passwordVerify(password, loginUser.password)) {
        next(createError(400, "worng password"));
      } else {
        //token
        const token = createToken({ id: loginUser._id }, "365d");

        res.status(200).cookie("authToken", token).json({
          message: "user login successfully",
          user: loginUser,
          token: token,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @access public
 * @route /api/login/me
 * @mehtod get
 */

export const loggedinUser = async (req, res, next) => {
  try {
    const Auth_token = req.headers.authorization;

    if (!Auth_token) {
      next(createError(400, "token not found"));
    }

    if (Auth_token) {
      const token = Auth_token.split(" ")[1];
      const user = tokenVerify(token);

      if (!user) {
        next(createError(400, "invalild token"));
      }

      if (user) {
        const loggedinUser = await User.findById(user.id);
      }

      if (!loggedinUser) {
        next(createError(400, "loggdnUser not found"));
      }

      if (loggedinUser) {
        res.status(200).json({
          message: "Ueer data stavle",
          user: loggedinUser,
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Account acctivateAccount email
 */
export const acctivateAccount = async (req, res, next) => {
  try {
    //get token
    const { token } = req.params;

    //check token
    if (!token) {
      next(createError(400, "token invalid, try agin"));
    } else {
      //token verify
      const tokenData = tokenVerify(token);

      //check token
      if (!tokenData) {
        next(createError(400, " invalid token"));
      }

      //now acctivate account
      if (tokenData) {
        const account = await User.findById(tokenData.id);

        if (account.isActivate == true) {
          next(createError(400, "Account already Activate"));
        } else {
          await User.findByIdAndUpdate(tokenData.id, {
            isActivate: true,
            access_token: "",
          });

          res.status(200).json({
            message: "account activation is Successfully",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * account activation  code
 */

export const acctivateAccountBycode = async (req, res, next) => {
  try {
    const { code, email } = req.body;

    const user = await User.findOne().or([{ email: email }, { mobile: email }]);

    if (!user) {
      next(createError(404, "User activation not found"));
    } else {
      if (user.isActivate == true) {
        next(createError(404, "User account already activate", "warn"));
      } else {
        if (user.access_token != code) {
          next(createError(404, "Otp code not match", "warn"));
        } else {
          await User.findByIdAndUpdate(user._id, {
            isActivate: true,
            access_token: "",
          });

          res.status(200).json({
            message: "use activation successfully",
          });
        }
      }
    }
  } catch (error) {
    nest(error.message);
  }
};

/**
 * forgot password
 */

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      next(createError(404, "user not found"));
    }

    if (user) {
      //forgotpassword reset token
      const password_resetTOken = createToken({ id: user._id }, "30m");

      //create access token
      let activationCode = getRandom(10000, 99999);

      //check activation code
      const checkCode = await User.findOne({ access_token: activationCode });

      if (checkCode) {
        activationCode = getRandom(10000, 99999);
      }

      //forgot password activation link
      forgotPasswordLink(user.email, {
        name: user.first_name + " " + user.sur_name,
        link: `${process.env.APP_URL}:${process.env.SERVER_PORT}/api/v1/user/forgot-password/${password_resetTOken}`,
        code: activationCode,
      });

      await User.findByIdAndUpdate(user._id, {
        access_token: activationCode,
      });

      res.status(200).json({
        message: "password reset link has sent to your email",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Account FORGOT PASSWORD ACTION
 */
export const forgotPasswordAction = async (req, res, next) => {
  try {
    //get token
    const { token } = req.params;
    const { password } = req.body;

    //check token
    if (!token) {
      next(createError(400, "invalid password reset link"));
    } else {
      //token verify
      const tokenData = tokenVerify(token);

      //check token
      if (!tokenData) {
        next(createError(400, " invalid token"));
      }

      //now acctivate account
      if (tokenData) {
        const user = await User.findById(tokenData.id);

        if (!user) {
          next(createError(400, "invalid user id"));
        }

        if (user) {
          await User.findByIdAndUpdate(user._id, {
            password: hashPassword(password),
            access_token: "",
          });

          res.status(200).json({
            message: "password change",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * FORGOT PASSWORD activation  code
 */

export const ForgotacctivateAccountBycode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const { password } = req.body;

    const user = await User.findOne().and([
      { access_token: code },
      { isActivate: false },
    ]);

    if (!user) {
      next(createError(400, "ativation use not found"));
    }

    if (user) {
      await User.findByIdAndUpdate(user._id, {
        isActivate: true,
        password: hashPassword(password),
        access_token: "",
      });

      res.status(200).json({
        message: "reset password use activation code successfully",
      });
    }
  } catch (error) {
    nest(error);
  }
};
