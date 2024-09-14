import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/reducer";
import { useState } from "react";

// Define the types for form values
interface LoginFormValues {
  email: string;
  password: string;
}

// Schema and Initial Values
const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const initialValuesLogin: LoginFormValues = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Login function
  const login = async (
    values: LoginFormValues,
    onSubmitProps: FormikHelpers<LoginFormValues>
  ) => {
    try {
      setLoading(true);
      const loggedInResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await loggedInResponse.json();
      onSubmitProps.resetForm();

      if (data.statusCode === 200) {
        dispatch(setLogin({ user: data.user }));
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error: any) {
      alert(`Error during loggin in : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="py-16 px-5 min-w-[30vw]">
        <Formik
          onSubmit={login}
          initialValues={initialValuesLogin}
          validationSchema={loginSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="max-w-md w-full p-6 border border-gray-300 rounded-lg shadow-md bg-white"
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 mt-1">{errors.email}</div>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 mt-1">{errors.password}</div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {loading ? "Loggin in user ..." : "Login"}
                </button>
                <p
                  className="mt-4 text-blue-500 cursor-pointer underline"
                  onClick={() => {
                    navigate("/register");
                    resetForm();
                  }}
                >
                  Don’t have an account? Sign up here.
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
