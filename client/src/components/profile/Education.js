import React from "react";
import Moment from "react-moment";
const Education = ({
  education: { current, to, from, description, school, degree, fieldofstudy }
}) => {
  return (
    <div>
      <h3 className="text-dark">{school}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -
        {!to ? "Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
      <p>
        <strong>fieldofstudy: </strong>
        {fieldofstudy}
      </p>
    </div>
  );
};

export default Education;
