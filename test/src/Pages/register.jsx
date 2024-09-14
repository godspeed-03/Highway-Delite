import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/reducer";
import { useRef } from "react";

// Validation Schema
const registerSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(/^[a-zA-Z\s-]+$/, 'Full Name can only contain letters, spaces, and hyphens')
    .required('Full Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
  avatar: Yup.mixed()
    .test('fileSize', 'File is too large', value => !value || value.size <= 2000000) // max 2MB
    .test('fileType', 'Unsupported file type', value => !value || ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type))
    .required('Avatar is required')
});
// Initial form values
const initialValuesRegister = {
  fullName: "",
  email: "",
  password: "",
  avatar: null,
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const register = async (values, onSubmitProps) => {
    const formData = new FormData();

    for (let value in values) {
      if (value === "avatar" && values[value]) {
        formData.append(value, values[value]);
      } else {
        formData.append(value, values[value] || "");
      }
    }

    const savedUserResponse = await fetch(
      "http://localhost:8080/api/v1/user/register",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await savedUserResponse.json();
    onSubmitProps.resetForm();

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.log(data.data.email)

    if (data.statusCode === 200) {
      navigate(`/verifyotp/${data.data.email}`);
    } else {
      // Handle error case (e.g., show a message to the user)
      alert(data.message); // Consider using a notification system
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="py-16 px-5  min-w-[30vw]">
      <Formik
        onSubmit={register}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
          isSubmitting
        }) => (
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full p-6 border border-gray-300 rounded-lg shadow-md bg-white"
          >
            {/* Full Name Input */}
            <div className="mb-4">
              <label
                htmlFor="fullName"
                className="block text-gray-700 font-semibold mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullName || ""}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${touched.fullName && errors.fullName ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
              />
              {touched.fullName && errors.fullName && (
                <div className="text-red-500 mt-1">{errors.fullName}</div>
              )}
            </div>

            {/* Email Input */}
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
                value={values.email || ""}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${touched.email && errors.email ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-4">
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
                value={values.password || ""}
                className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${touched.password && errors.password ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
              />
              {touched.password && errors.password && (
                <div className="text-red-500 mt-1">{errors.password}</div>
              )}
            </div>

            {/* Avatar Input */}
            <div className="mb-4">
              <label
                htmlFor="avatar"
                className="block text-gray-700 font-semibold mb-2"
              >
                Avatar
              </label>
              <input
                id="avatar"
                type="file"
                accept=".jpg,.jpeg,.png"
                ref={fileInputRef}
                onChange={(event) =>
                  setFieldValue("avatar", event.currentTarget.files[0] || null)
                }
                className={`w-full p-2 border border-gray-300 rounded-md ${touched.avatar && errors.avatar ? 'border-red-500' : ''}`}
              />
              {touched.avatar && errors.avatar && (
                <div className="text-red-500 mt-1">{errors.avatar}</div>
              )}
              {values.avatar && <p className="mt-1 text-gray-700">{values.avatar.name}</p>}
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                Register
              </button>
            </div>

            {/* Login Redirection */}
            <p
              className="mt-4 text-blue-500 cursor-pointer underline"
              onClick={() => {
                  navigate("/");
                  resetForm();
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
              }}
            >
              Already have an account? Login here.
            </p>
          </form>
        )}
      </Formik>
    </div>
    </div>
  );
};

export default Register;
