"use client";
import { Input, Button, Checkbox } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { motion } from "framer-motion";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";

const Page = () => {
  const [isLogin, setLogin] = useState(true);
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL);
  const router = useRouter();

  const GoogleLogin = async () => {
    const authData = await pb.collection("users").authWithOAuth2({
      provider: "google",
    });

    if (authData) {
      try {
        const res = await fetch("/api/googlesignin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(authData),
        });

        if (res.ok) {
          console.log("Login successful");
          router.push("/auth");
        }
      } catch (error) {
        console.log("Error whild login: ", error);
      }
    }
  };

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),
    password: Yup.string()
      .min(8, "Must be 8 characters or more")
      .max(72, "Must be 72 characters or less")
      .required("Please enter your password"),
  });

  const RegisterSchema = Yup.object({
    remail: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email"),
    rpassword: Yup.string()
      .min(8, "Must be 8 characters or more")
      .max(72, "Must be 72 characters or less")
      .required("Please enter your password"),
    rconfirmpassword: Yup.string()
      .oneOf([Yup.ref("rpassword")], "Password not match")
      .required("Please enter your confirm password"),
  });

  const formik = useFormik({
    initialValues: isLogin
      ? {
          email: "",
          password: "",
          remember: false,
        }
      : { remail: "", rpassword: "", rconfirmpassword: "" },
    validationSchema: isLogin ? LoginSchema : RegisterSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isLogin) {
        console.log("Login: ", values.email, values.password, values.remember);

        resetForm({
          values: {
            email: "",
            password: "",
            remember: false,
          },
        });
      } else {
        try {
          const res = await fetch("/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.remail,
              password: values.rpassword,
              passwordConfirm: values.rconfirmpassword,
            }),
          });
          if (res.ok) {
            setLogin(true);
            alert("Register successful");
          } else {
            const errorData = await res.json();
            console.log(errorData);
            throw new Error(errorData.message);
          }
        } catch (error) {
          alert((error as Error).message);
        }
        resetForm({
          values: {
            remail: "",
            rpassword: "",
            rconfirmpassword: "",
          },
        });
      }
    },
  });

  return (
    <>
      {isLogin && (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
              <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                <div className="w-3/5 p-5">
                  <motion.div
                    className="text-left font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.4,
                    }}
                  >
                    <span className="text-red-700">Tec</span>.
                    <span className="text-gray-500">Dev</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{
                      type: "tween",
                      ease: "backInOut",
                      duration: 0.8,
                      delay: 0.2,
                    }}
                  >
                    <div className="pt-10 pb-5">
                      <h2 className="text-3xl font-bold text-red-700 mb-2">
                        Login
                      </h2>
                      <div className="border-2 w-10 border-red-700 inline-block mb-2"></div>
                      <div className="flex justify-center my-2">
                        <a
                          href="#"
                          onClick={GoogleLogin}
                          className="border-2 border-gray-200 rounded-full p-3 mx-1"
                        >
                          <FcGoogle className="" />
                        </a>
                      </div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="flex flex-col items-center gap-20">
                        <div className="w-64 relative">
                          <Input
                            id="email"
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            isInvalid={
                              formik.touched.email &&
                              Boolean(formik.errors.email)
                            }
                            color={
                              formik.touched.email && formik.errors.email
                                ? "danger"
                                : "default"
                            }
                            errorMessage={formik.errors.email}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className="absolute inset-x-0 top-0 mx-auto"
                          />
                        </div>
                        <div className="w-64 relative">
                          <Input
                            id="password"
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            isInvalid={
                              formik.touched.password &&
                              Boolean(formik.errors.password)
                            }
                            color={
                              formik.touched.password && formik.errors.password
                                ? "danger"
                                : "default"
                            }
                            errorMessage={formik.errors.password}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="absolute inset-x-0 top-0"
                          />
                        </div>
                        <div className="flex justify-between w-64 mb-5 mt-3">
                          <label className="flex items-center text-xs">
                            <Checkbox
                              size="sm"
                              color="danger"
                              isSelected={formik.values.remember}
                              onChange={() =>
                                formik.setFieldValue(
                                  "remember",
                                  !formik.values.remember
                                )
                              }
                            ></Checkbox>
                            Remember me
                          </label>
                          <a href="#" className="text-xs">
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      <div className="mb-3">
                        <Button
                          type="submit"
                          className="bg-red-700 text-white hover:bg-red-500 w-24"
                        >
                          SIGN IN
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
                <motion.div
                  className="w-2/5 bg-red-700 text-white rounded-r-2xl py-36 px-12"
                  initial={{ opacity: 0, x: -450 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.8,
                  }}
                >
                  <h2 className="text-3xl font-bold mb-2">New user?</h2>
                  <div className="border-2 w-10 border-white inline-block mb-2"></div>
                  <p className="mb-10">
                    To access this website let's create an account
                  </p>
                  <Button
                    onClick={() => {
                      setLogin(false);
                    }}
                    className="bg-white text-red-700 rounded-full px-12 py-2 inline-block font-semibold hover:bg-red-900 hover:text-white hover:shadow-md"
                  >
                    SIGN UP
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </>
      )}
      {!isLogin && (
        <>
          <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
              <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                <motion.div
                  className="w-2/5 bg-red-700 text-white rounded-l-2xl py-36 px-12"
                  initial={{ opacity: 0, x: 450 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.8,
                  }}
                >
                  <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
                  <div className="border-2 w-10 border-white inline-block mb-2"></div>
                  <p className="mb-10">
                    To keep connected with us login with your personal info
                  </p>
                  <Button
                    onClick={() => {
                      setLogin(true);
                    }}
                    className="bg-white text-red-700 rounded-full px-12 py-2 inline-block font-semibold hover:bg-red-900 hover:text-white hover:shadow-md"
                  >
                    SIGN IN
                  </Button>
                </motion.div>
                <div className="w-3/5 p-5">
                  <motion.div
                    className="text-right font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: 0.4,
                    }}
                  >
                    <span className="text-red-700">Tec</span>.
                    <span className="text-gray-500">Dev</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{
                      type: "tween",
                      ease: "backInOut",
                      duration: 0.8,
                      delay: 0.2,
                    }}
                  >
                    <div className="pt-10 pb-5">
                      <h2 className="text-3xl font-bold text-red-700 mb-2">
                        Register
                      </h2>
                      <div className="border-2 w-10 border-red-700 inline-block mb-2"></div>
                      <div className="flex justify-center my-2"></div>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="flex flex-col items-center gap-20">
                        <div className="w-64 relative">
                          <Input
                            id="remail"
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            isInvalid={
                              formik.touched.remail &&
                              Boolean(formik.errors.remail)
                            }
                            color={
                              formik.touched.remail && formik.errors.remail
                                ? "danger"
                                : "default"
                            }
                            errorMessage={formik.errors.remail}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.remail}
                            className="absolute inset-x-0 top-0 mx-auto"
                          />
                        </div>
                        <div className="w-64 relative">
                          <Input
                            id="rpassword"
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            isInvalid={
                              formik.touched.rpassword &&
                              Boolean(formik.errors.rpassword)
                            }
                            color={
                              formik.touched.rpassword &&
                              formik.errors.rpassword
                                ? "danger"
                                : "default"
                            }
                            errorMessage={formik.errors.rpassword}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.rpassword}
                            className="absolute inset-x-0 top-0"
                          />
                        </div>
                        <div className="w-64 relative">
                          <Input
                            id="rconfirmpassword"
                            type="password"
                            label="Confirm Password"
                            placeholder="Enter your confirm password"
                            isInvalid={
                              formik.touched.rconfirmpassword &&
                              Boolean(formik.errors.rconfirmpassword)
                            }
                            color={
                              formik.touched.rconfirmpassword &&
                              formik.errors.rconfirmpassword
                                ? "danger"
                                : "default"
                            }
                            errorMessage={formik.errors.rconfirmpassword}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.rconfirmpassword}
                            className="absolute inset-x-0 top-0"
                          />
                        </div>
                      </div>
                      <div className="mt-20 mb-2">
                        <Button
                          type="submit"
                          className="bg-red-700 text-white hover:bg-red-500 w-24 mt-5 mb-1"
                        >
                          SIGN UP
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;
