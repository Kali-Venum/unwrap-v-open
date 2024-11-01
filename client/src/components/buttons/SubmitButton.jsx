import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";

const SubmitButton = ({ buttonText }) => {
  return (
    <div>
      <Button
        type="submit"
        className="transition-all shadow-xl text-primary font-bold bg-white-color rounded-lg text-base px-3 py-2 sm:px-5 sm:py-2 min-w-[110px] sm:w-auto text-center"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default SubmitButton;

SubmitButton.propTypes = {
  buttonText: PropTypes.string.isRequired,
};
