import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useFormik, userFormik } from "formik";
import * as Yup from "yup";

export default function ChangeEmailForm(props) {
  const { user, logout, setReloadUser } = props;

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(user.name, user.lastname),
    validationSchema: Yup.object(validationSchema()),
    onSubmit: async (formData) => {
      setLoading(true);
      /*const response = await updateNameApi(user.id, formData, logout);
      console.log(response);*/
      if (!response) {
        toast.error("Error al actualizar email");
      } else {
        setReloadUser(true);
        toast.success("El email ha sido actualizado");
      }
      setLoading(false);
    },
  });

  return (
    <div className="change-email-form">
      <h4>
        Cambia tu e-mail <span>(Tu e-mail actual: {user.email})</span>
      </h4>

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            name="email"
            placeholder="Tu nuevo e-mail"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.errors.email}
          />
          <Form.Input
            name="repeatEmail"
            placeholder="Confirma tu nuevo e-mail"
            onChange={formik.handleChange}
            value={formik.values.repeatEmail}
            error={formik.errors.repeatEmail}
          />
        </Form.Group>
        <Button className="submit">Actualizar</Button>
      </Form>
    </div>
  );
}

function initialValues(name, lastname) {
  return {
    email: "",
    repeatEmail: "",
  };
}

function validationSchema() {
  return {
    email: Yup.string().email(true).required(true),
    repeatEmail: Yup.string().email(true).required(true),
  };
}
