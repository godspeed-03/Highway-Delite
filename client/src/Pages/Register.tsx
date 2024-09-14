import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  avatar: File | null;
  [key: string]: string | File | null;
}
const registerSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(
      /^[a-zA-Z\s-]+$/,
      "Full Name can only contain letters, spaces, and hyphens"
    )
    .required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  avatar: Yup.mixed<File>()
    .test(
      "fileSize",
      "File is too large",
      (value) => !value || value.size <= 2000000
    ) // max 2MB
    .test(
      "fileType",
      "Unsupported file type",
      (value) =>
        !value || ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
    )
    .required("Avatar is required"),
});

const initialValuesRegister: RegisterFormValues = {
  fullName: "",
  email: "",
  password: "",
  avatar: null,
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (
    values: RegisterFormValues,
    onSubmitProps: FormikHelpers<RegisterFormValues>
  ) => {
    const formData = new FormData();

    for (const key in values) {
      if (key === "avatar" && values[key]) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key] || "");
      }
    }

    try {
      setLoading(true);
      const savedUserResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/register`,
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

      if (data.statusCode === 200) {
        navigate(`/verifyotp/${data.data.email}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="py-16 px-5 min-w-[30vw]">
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
            isSubmitting,
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
                  className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                    touched.fullName && errors.fullName
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
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
                  className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
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
                  className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                    touched.password && errors.password
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
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
                    setFieldValue(
                      "avatar",
                      event.currentTarget.files
                        ? event.currentTarget.files[0]
                        : null
                    )
                  }
                  className={`w-full p-2 border border-gray-300 rounded-md ${
                    touched.avatar && errors.avatar ? "border-red-500" : ""
                  }`}
                />
                {touched.avatar && errors.avatar && (
                  <div className="text-red-500 mt-1">{errors.avatar}</div>
                )}
                {values.avatar && (
                  <p className="mt-1 text-gray-700">{values.avatar.name}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {loading ? "Registering User ..." : "Register"}
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
