import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  question: yup.string().required("Question is required"),
  options: yup.array().of(yup.string().required("Option cannot be empty")).min(2, "At least 2 options required"),
});

export default function PollForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    console.log(data); // later -> send to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register("question")} placeholder="Enter poll question" className="border p-2 w-full" />
      <p className="text-red-500">{errors.question?.message}</p>
      
      <input {...register("options[0]")} placeholder="Option 1" className="border p-2 w-full" />
      <input {...register("options[1]")} placeholder="Option 2" className="border p-2 w-full" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Poll
      </button>
    </form>
  );
}
