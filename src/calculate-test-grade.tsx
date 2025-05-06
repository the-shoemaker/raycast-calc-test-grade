import { Form, ActionPanel, Action, useNavigation, showToast, Clipboard, Detail } from "@raycast/api";
import { FC } from "react";

// Define types for the form values
interface FormValues {
  yourpoints: string;
  totalpoints: string;
}

// Form screen component
const Command: FC = () => {
  const { push } = useNavigation();

  const handleSubmit = (values: FormValues) => {
    const yourPoints = parseFloat(values.yourpoints);
    const totalPoints = parseFloat(values.totalpoints);

    if (isNaN(yourPoints) || isNaN(totalPoints) || totalPoints === 0) {
      showToast({ title: "Invalid Input", message: "Please enter valid numbers for both fields." });
      return;
    }

    const grade = (yourPoints * 5) / totalPoints + 1;
    push(<ResultScreen grade={grade.toFixed(2)} />);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Calculate Grade"
            onSubmit={handleSubmit}
            shortcut={{ modifiers: [], key: "enter" }}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Enter your points + total points to calculate your grade." />
      <Form.TextField id="yourpoints" title="Your Points" placeholder="e.g., 10" />
      <Form.TextField id="totalpoints" title="Total Points" placeholder="e.g., 20" />
    </Form>
  );
};

// Define the props for the ResultScreen component
interface ResultScreenProps {
  grade: string;
}

// Result screen component
const ResultScreen: FC<ResultScreenProps> = ({ grade }) => {
  const { pop } = useNavigation();

  const handleCopyAndPop = async () => {
    await Clipboard.copy(grade); // Use Raycast's Clipboard API to copy the grade
    showToast({ title: "Copied to Clipboard", message: `Grade: ${grade}` });
    pop();
  };

  return (
    <Detail
      markdown={`# Your Grade\n\n## ${grade}`}
      actions={
        <ActionPanel>
          <Action title="Copy and Go Back" onAction={handleCopyAndPop} shortcut={{ key: "enter", modifiers: [] }} />
        </ActionPanel>
      }
    />
  );
};

export default Command;