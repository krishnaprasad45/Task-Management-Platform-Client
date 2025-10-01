import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./otpstyle.css";

import { ToastContainer } from "react-toastify";
import { showErrorToast, showSuccessToast } from "../../services/popups/popups";
import { userAxios } from "../../Constraints/axiosInterceptor";
import { imageUrls } from "../../constants/strings";
interface ResponseData {
  data: {
    message: string;
  };
}
const OTPPage: React.FC = () => {
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.data;
  useEffect(() => {
    const handleKeyUp = (
      e: KeyboardEvent,
      index1: number,
      currentInputValue: string
    ) => {
      const currentInput = e.target as HTMLInputElement,
        nextInput = currentInput.nextElementSibling as HTMLInputElement | null,
        prevInput =
          currentInput.previousElementSibling as HTMLInputElement | null;

      if (currentInputValue.length > 1) {
        currentInput.value = "";
        return;
      }
      if (
        nextInput &&
        nextInput.hasAttribute("disabled") &&
        currentInputValue !== ""
      ) {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
      }
      if (e.key === "Backspace") {
        inputs.forEach((input, index2) => {
          if (index1 <= index2 && prevInput) {
            input.setAttribute("disabled", "true");
            input.value = "";
            prevInput.focus();
          }
        });
      }
      if (!inputs[3].disabled && inputs[3].value !== "") {
        button?.classList.add("active");
      } else {
        button?.classList.remove("active");
      }

      // Updating the state with the entered OTP digit
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index1] = currentInputValue;
      setOtpDigits(newOtpDigits);
    };

    const inputs = document.querySelectorAll<HTMLInputElement>("input");
    const button = document.querySelector<HTMLButtonElement>("button");

    inputs.forEach((input, index1) => {
      input.addEventListener("keyup", (e) => {
        const currentInput = e.target as HTMLInputElement;
        handleKeyUp(e, index1, currentInput.value);
      });
    });
    window.addEventListener("load", () => inputs[0].focus());
    return () => {
      inputs.forEach((input, index1) => {
        input.removeEventListener("keyup", (e) => handleKeyUp(e, index1, ""));
      });
    };
  }, [otpDigits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp) {
      try {
        const response = await userAxios.post("/otp", {
          enteredOtp,
          email,
        });

        // eslint-disable-next-line no-constant-condition
        if (response) {
          showSuccessToast("Account Created");
          setTimeout(() => {
            navigate("/login");
          }, 2300);
        } else {
          showErrorToast((response as ResponseData).data.message);
        }
      } catch (error) {
        showErrorToast((error as Error).message);
      }
    }
  };
  return (
    <div
      className="otp-container otp-body"
      style={{
        backgroundImage: `url(${imageUrls.imageUrl3})`,
        backgroundSize: "cover",
      }}
    >
      {" "}
      <h1 className="font-semibold ">We sent OTP to your email </h1>
      <ToastContainer />
      <i> {email}</i>
      <h4>Enter OTP Code</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-field ">
          <input type="number" />
          <input type="number" disabled />
          <input type="number" disabled />
          <input type="number" disabled />
        </div>
        <button className="verify-button">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPPage;
