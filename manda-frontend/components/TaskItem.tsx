type TaskItemProps = {
  title: string;
  done: boolean;
};

export default function TaskItem({ title, done }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-white shadow-sm">
      <span className={done ? "line-through text-gray-400" : "text-gray-800"}>
        {title}
      </span>
      {done && <span className="text-green-500 text-sm">✓ fait</span>}
    </li>
  );
}