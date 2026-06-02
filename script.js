let stream = null;
let photos = [];
let shooting = false;

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    const video = document.getElementById('video-preview');
    video.srcObject = stream;
    video.play();
  } catch(e) {
    document.getElementById('countdown-display').textContent = 'Kamera tidak tersedia';
  }
}

async function startShooting() {
  if (shooting) return;
  shooting = true;
  photos = [];
  document.getElementById('shoot-btn').disabled = true;

  const video = document.getElementById('video-preview');
  for (let i = 0; i < 3; i++) {
    await countdown(3);
    const dataUrl = captureFrame(video);
    photos.push(dataUrl);

    const box = document.getElementById('prev' + (i + 1));
    const img = document.createElement('img');
    img.src = dataUrl;
    box.innerHTML = '';
    box.appendChild(img);
    const num = document.createElement('span');
    num.className = 'cam-number';
    num.textContent = i + 1;
    box.appendChild(num);

    document.getElementById('countdown-display').textContent = '';
    if (i < 2) await sleep(600);
  }

  shooting = false;
  localStorage.setItem('photos', JSON.stringify(photos));
  if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
  location.href = 'results.html';
}

function captureFrame(video) {
  const c = document.createElement('canvas');
  c.width = video.videoWidth || 640;
  c.height = video.videoHeight || 480;
  c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.9);
}

function countdown(n) {
  return new Promise(resolve => {
    const el = document.getElementById('countdown-display');
    let count = n;
    el.textContent = count;
    const iv = setInterval(() => {
      count--;
      if (count <= 0) { clearInterval(iv); el.textContent = ''; resolve(); }
      else el.textContent = count;
    }, 1000);
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}