import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const FormWrapper = ({ defaultValues, schema, onSubmit, children }) => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode : 'onTouched'
  });

  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            {children}
        </form>
    </FormProvider>
  )
};

export default FormWrapper;
