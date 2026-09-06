$w.onReady(function () {
  function countUp(id, endValue) {
    const duration = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      $w(id).text = String(Math.round(progress * endValue));
      $w(id).style.color = "#6E1423";
      if (progress === 1) clearInterval(timer);
    }, 20);
  }

  $w('#statsSection').onViewportEnter(() => {
    countUp('#countCountries', 9);
    countUp('#countRegions', 5);
    countUp('#countDesigners', 9);
  });
});