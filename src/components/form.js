import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";

const orderSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is a required field.")
    .test(
      "len",
      "Must be 2 or more characters",
      (val) => val && val.toString().length >= 2
    ),
  size: yup.string(),
  special: yup.string(),
  Sausage: yup.string(),
  Pepperoni: yup.string(),
  Feta: yup.string(),
  Mushroom: yup.string(),
});
const topping = [
  { _id: 1, label: "Sausage" },
  { _id: 2, label: "Pepperoni" },
  { _id: 3, label: "Feta" },
  { _id: 4, label: "Mushroom" },
];

export default function Form() {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [formState, setFormState] = useState({
    name: "",
    size: "",
    Sausage: "",
    Pepperoni: "",
    Feta: "",
    Mushroom: "",
    special: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    size: "",
    Sausage: "",
    Pepperoni: "",
    Feta: "",
    Mushroom: "",
    special: "",
  });
  const [post, setPost] = useState([]);

  useEffect(() => {
    orderSchema.isValid(formState).then((valid) => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const formSubmit = (e) => {
    e.preventDefault();
    e.persist();
    axios
      .post("https://reqres.in/api/users", formState)
      .then((res) => {
        setPost(res.data);
        console.log("success", post);
        setFormState({
          name: "",
          size: "",
          Sausage: "",
          Pepperoni: "",
          Feta: "",
          Mushroom: "",
          special: "",
        });
      })
      .catch((err) => console.log(err.response));
  };

  const validation = (e) => {
    yup
      .reach(orderSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({
          ...errors,
          [e.target.name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        });
      });
  };

  const watchedChange = (e) => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };

    validation(e);
    setFormState(newFormData);
  };

  return (
    <div>
      <form onSubmit={formSubmit}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={watchedChange}
            data-cy="name"
          />
        </label>
        <label htmlFor="size">
          Pizza size:
          <select id="size" name="size" onChange={watchedChange}>
            <option value="12">12 in</option>
            <option value="14">14 in</option>
            <option value="16">16 in</option>
            <option value="18">18 in</option>
          </select>
        </label>
        <ul>
          {topping.map((v, i) => (
            <li id={v.label} htmlFor={v.label}>
              <input
                type="checkbox"
                name={v.label}
                data-key={v._id} // 3
                data-cy={v.label}
                onChange={watchedChange} // 4
              />
              <label>{v.label}</label>
            </li>
          ))}
        </ul>
        <label htmlFor="special">
          Anything Else?
          <textarea
            name="special"
            value={formState.special}
            onChange={watchedChange}
          />
        </label>
        <button data-cy="Submit" disabled={buttonDisabled}>
          Submit
        </button>

        <pre>{JSON.stringify(post, null, 2)}</pre>
      </form>
    </div>
  );
}
