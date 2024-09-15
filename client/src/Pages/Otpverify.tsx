import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/reducer";

interface OtpFormValues {
  otp: string;
}

// Validation Schema
const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be a 6-digit number")
    .required("OTP is required"),
});

const initialValuesOtp: OtpFormValues = {
  otp: "",
};

const OtpVerification: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useParams<{ email: string }>();

  const verifyOtp = async (
    values: OtpFormValues,
    onSubmitProps: FormikHelpers<OtpFormValues>
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/verifyotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otp: values.otp }),
        }
      );

      const data = await response.json();

      if (data.statusCode === 201) {
        dispatch(setLogin({ user: data.data.user }));
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      onSubmitProps.setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="py-16 px-5 min-w-[30vw]">
        <Formik
          onSubmit={verifyOtp}
          initialValues={initialValuesOtp}
          validationSchema={otpSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="max-w-md w-full p-6 border border-gray-300 rounded-lg shadow-md bg-white"
            >
              {/* OTP Input */}
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.otp}
                  className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none ${
                    touched.otp && errors.otp
                      ? "border-red-500"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                {touched.otp && errors.otp && (
                  <div className="text-red-500 mt-1">{errors.otp}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mb-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
               Verify OTP
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default OtpVerification;
