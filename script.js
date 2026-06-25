  // ───────────────────────────────────────────────
        //  DOM refs
        // ───────────────────────────────────────────────
        const tabBtns = document.querySelectorAll('.tab-btn');
        const panels = {
            file: document.getElementById('panel-file'),
            url: document.getElementById('panel-url'),
        };

        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');
        const filePreview = document.getElementById('filePreview');
        const filePreviewImg = document.getElementById('filePreviewImg');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');

        const urlInput = document.getElementById('urlInput');
        const urlPreview = document.getElementById('urlPreview');
        const urlPreviewImg = document.getElementById('urlPreviewImg');

        const removeFileBtn = document.getElementById('removeFileBtn');
        const removeUrlBtn = document.getElementById('removeUrlBtn');

        const statusEl = document.getElementById('status');
        const resultSection = document.getElementById('resultSection');
        const resultOriginal = document.getElementById('resultOriginal');
        const resultNoBg = document.getElementById('resultNoBg');
        const downloadBtn = document.getElementById('downloadBtn');

        // ───────────────────────────────────────────────
        //  State
        // ───────────────────────────────────────────────
        let selectedFile = null; // File object
        let selectedUrl = '';
        let resultData = null; // ArrayBuffer
        let resultBlobUrl = '';

        const API_KEY = 'M6t7eBWGwaxPMP1oBttTJ9vk';

        // ───────────────────────────────────────────────
        //  Tabs
        // ───────────────────────────────────────────────
        tabBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                tabBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                Object.keys(panels).forEach((key) => {
                    panels[key].classList.toggle('active', key === tab);
                });
                hideStatus();
                resultSection.classList.remove('show');
                // Reset URL preview when switching to file
                if (tab === 'file') {
                    urlPreview.style.display = 'none';
                    removeUrlBtn.disabled = true;
                } else {
                    filePreview.style.display = 'none';
                    removeFileBtn.disabled = true;
                }
            });
        });

        // ───────────────────────────────────────────────
        //  File upload
        // ───────────────────────────────────────────────
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length) handleFile(files[0]);
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) handleFile(fileInput.files[0]);
        });

        function handleFile(file) {
            const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                showStatus('Please select a PNG, JPG, or WEBP image.', 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showStatus('File size must be under 10MB.', 'error');
                return;
            }

            selectedFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                filePreviewImg.src = e.target.result;
                filePreview.style.display = 'flex';
                fileName.textContent = file.name;
                fileSize.textContent = (file.size / 1024).toFixed(1) + ' KB';
                removeFileBtn.disabled = false;
                hideStatus();
                resultSection.classList.remove('show');
            };
            reader.readAsDataURL(file);
        }

        // ───────────────────────────────────────────────
        //  URL input
        // ───────────────────────────────────────────────
        urlInput.addEventListener('input', () => {
            const val = urlInput.value.trim();
            if (val && isValidUrl(val)) {
                selectedUrl = val;
                urlPreviewImg.src = val;
                urlPreview.style.display = 'block';
                removeUrlBtn.disabled = false;
                hideStatus();
                resultSection.classList.remove('show');
            } else {
                urlPreview.style.display = 'none';
                removeUrlBtn.disabled = true;
            }
        });

        function isValidUrl(str) {
            try {
                const url = new URL(str);
                return url.protocol === 'http:' || url.protocol === 'https:';
            } catch {
                return false;
            }
        }

        // ───────────────────────────────────────────────
        //  Remove Background (API call)
        // ───────────────────────────────────────────────
        async function removeBackground(payload) {
            const formData = new FormData();
            formData.append('size', 'auto');

            if (payload.file) {
                formData.append('image_file', payload.file);
            } else if (payload.url) {
                formData.append('image_url', payload.url);
            }

            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: { 'X-Api-Key': API_KEY },
                body: formData,
            });

            if (!response.ok) {
                let errMsg = `${response.status}: ${response.statusText}`;
                try {
                    const errJson = await response.json();
                    if (errJson.errors && errJson.errors.length) {
                        errMsg = errJson.errors[0].title || errMsg;
                    }
                } catch (_) { /* ignore */ }
                throw new Error(errMsg);
            }

            return await response.arrayBuffer();
        }

        // ───────────────────────────────────────────────
        //  Handlers: Remove File
        // ───────────────────────────────────────────────
        removeFileBtn.addEventListener('click', async () => {
            if (!selectedFile) return;
            await processRemoval({ file: selectedFile }, removeFileBtn);
        });

        // ───────────────────────────────────────────────
        //  Handlers: Remove URL
        // ───────────────────────────────────────────────
        removeUrlBtn.addEventListener('click', async () => {
            if (!selectedUrl) return;
            await processRemoval({ url: selectedUrl }, removeUrlBtn);
        });

        // ───────────────────────────────────────────────
        //  Core removal logic
        // ───────────────────────────────────────────────
        async function processRemoval(payload, btn) {
            const isFile = !!payload.file;
            const label = isFile ? selectedFile.name : selectedUrl;

            // Disable button & show loading
            btn.disabled = true;
            btn.classList.add('loading');
            btn.innerHTML = '<i class="fas fa-spinner"></i> Processing…';
            hideStatus();

            try {
                const buffer = await removeBackground(payload);
                resultData = buffer;

                // Create blob URL for display
                const blob = new Blob([buffer], { type: 'image/png' });
                const blobUrl = URL.createObjectURL(blob);
                resultBlobUrl = blobUrl;

                // Show result
                // Original preview
                if (isFile) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        resultOriginal.src = e.target.result;
                    };
                    reader.readAsDataURL(selectedFile);
                } else {
                    resultOriginal.src = selectedUrl;
                }
                resultNoBg.src = blobUrl;
                resultSection.classList.add('show');

                showStatus('Background removed successfully!', 'success');
            } catch (err) {
                showStatus(`Error: ${err.message || 'Something went wrong'}`, 'error');
                resultSection.classList.remove('show');
            } finally {
                btn.disabled = false;
                btn.classList.remove('loading');
                btn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Remove Background';
            }
        }

        // ───────────────────────────────────────────────
        //  Download
        // ───────────────────────────────────────────────
        downloadBtn.addEventListener('click', () => {
            if (!resultData) return;
            const blob = new Blob([resultData], { type: 'image/png' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'no-bg.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        });

        // ───────────────────────────────────────────────
        //  Status helpers
        // ───────────────────────────────────────────────
        function showStatus(msg, type = 'info') {
            statusEl.textContent = msg;
            statusEl.className = 'status ' + type;
            statusEl.style.display = 'block';
        }

        function hideStatus() {
            statusEl.className = 'status';
            statusEl.style.display = 'none';
        }

        // ───────────────────────────────────────────────
        //  Keyboard shortcut: Enter on URL input
        // ───────────────────────────────────────────────
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !removeUrlBtn.disabled) {
                removeUrlBtn.click();
            }
        });

        console.log('🚀 Professional BG Remover ready!');