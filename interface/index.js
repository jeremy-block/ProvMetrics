import Vizzu from "vizzu";

let data = {
  series: [
    {
      name: "Foo",
      values: ["Alice", "Bob", "Ted"],
    },
    {
      name: "Bar",
      values: [15, 32, 12],
    },
    {
      name: "Baz",
      values: [5, 3, 2],
    },
  ],
};

let chart = new Vizzu("myVizzu", {
  data,
});
chart.animate({
  x: "Foo",
  y: "Bar",
});
chart.animate({
  color: "Foo",
  x: "Baz",
  geometry: "circle",
});