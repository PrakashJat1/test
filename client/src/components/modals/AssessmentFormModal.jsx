import React, { useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Save, X, Pencil } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import * as yup from "yup";
import FormWrapper from "@/components/common/Form/FormWrapper";

const validationSchema = yup.object().shape({
  marks: yup.array().of(
    yup.object().shape({
      marks: yup
        .number()
        .typeError("Marks must be a number")
        .min(0, "Minimum is 0")
        .max(100, "Maximum is 100")
        .required("Marks required"),
      feedback: yup.string().max(500, "Too long"),
    })
  ),
});

const FormBody = ({ marksList }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <table className="table table-bordered align-middle text-center">
      <thead className="table-light">
        <tr>
          <th>👨‍🎓 Student Name</th>
          <th>✍️ Marks</th>
          <th>💬 Feedback</th>
        </tr>
      </thead>
      <tbody>
        {marksList.map((entry, index) => (
          <tr key={entry.studentId}>
            <td>
              <Form.Control
                value={entry.fullName}
                disabled
                plaintext
                readOnly
              />
            </td>
            <td>
              <Controller
                name={`marks.${index}.marks`}
                control={control}
                defaultValue={entry.marks}
                render={({ field }) => (
                  <Form.Control
                    type="number"
                    {...field}
                    className={
                      errors?.marks?.[index]?.marks ? "is-invalid" : ""
                    }
                  />
                )}
              />
              {errors?.marks?.[index]?.marks && (
                <div className="text-danger small">
                  {errors.marks[index].marks.message}
                </div>
              )}
            </td>
            <td>
              <Controller
                name={`marks.${index}.feedback`}
                control={control}
                defaultValue={entry.feedback}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={1}
                    {...field}
                    className={
                      errors?.marks?.[index]?.feedback ? "is-invalid" : ""
                    }
                  />
                )}
              />
              {errors?.marks?.[index]?.feedback && (
                <div className="text-danger small">
                  {errors.marks[index].feedback.message}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function AssessmentFormModal({ show, onClose, assessment, onSave }) {
  const marksList = useMemo(() => {
    return (
      assessment?.marks.map((entry) => ({
        studentId: entry.studentId._id,
        fullName: entry.studentId.userId.fullName,
        marks: entry.score || 0,
        feedback: entry.feedback || "",
      })) || []
    );
  }, [assessment]);

  const defaultValues = { marks: marksList };

  const handleSubmit = (data) => {
    onSave(data.marks);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          <Pencil className="me-2" size={20} />
          {assessment?.title} {assessment?.batchId?.batch_Name}
        </Modal.Title>
      </Modal.Header>

      <FormWrapper
        defaultValues={defaultValues}
        schema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Modal.Body>
          <FormBody marksList={marksList} />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            <X className="me-1" size={18} />
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            <Save className="me-1" size={18} />
            Save Changes
          </Button>
        </Modal.Footer>
      </FormWrapper>
    </Modal>
  );
}

export default AssessmentFormModal;
