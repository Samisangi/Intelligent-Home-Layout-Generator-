import jsPDF from "jspdf";

export const exportStageAsPNG = (stageRef, filename = "floor-plan.png") => {
  const uri = stageRef.current.toDataURL({ pixelRatio: 2 }); // 2x for crisp export
  const link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  link.click();
};

export const exportStageAsPDF = (stageRef, filename = "floor-plan.pdf") => {
  const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
  const stage = stageRef.current;
  const pdf = new jsPDF({
    orientation: stage.width() > stage.height() ? "landscape" : "portrait",
    unit: "px",
    format: [stage.width(), stage.height()],
  });
  pdf.addImage(uri, "PNG", 0, 0, stage.width(), stage.height());
  pdf.save(filename);
};