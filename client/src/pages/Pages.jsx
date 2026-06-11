import { useParams } from "react-router-dom";
import Canvas_Problem from "./CanvasPage";
import LC_Problem from "./lc-problem";

export default function Pages() {
  const { type, id } = useParams();
  const routeType =
    type === "code" ? "problem" : type === "canvas" ? "scratch" : type;
  if (routeType === "problem") {
    return <LC_Problem id={id} />;
  }
  if (routeType === "scratch") {
    return <Canvas_Problem id={id} />;
  }
  return <h1>Problem type not found</h1>;
}
