(() => {
  const STORAGE_KEYS = {
    settings: "sdcpp.webui.settings.v1",
    gallery: "sdcpp.webui.gallery.v1",
    discoveries: "sdcpp.webui.discoveries.v1",
    formValues: "sdcpp.webui.formValues.v1"
  };

  const DEFAULT_SETTINGS = {
    apiUrl: "",
    language: "auto",
    palette: "green",
    mode: "auto",
    autoSave: true
  };

  const GALLERY_LIMIT = 48;

  const PALETTES = {
    green: { hue: 142, sat: "46%", light: "42%" },
    blue: { hue: 212, sat: "65%", light: "48%" },
    purple: { hue: 265, sat: "55%", light: "52%" },
    yellow: { hue: 42, sat: "90%", light: "45%" },
    cyan: { hue: 185, sat: "65%", light: "40%" },
    red: { hue: 350, sat: "65%", light: "48%" }
  };

  const DISCOVERY = {
    models: { path: "/v1/models", title: "GET /v1/models" },
    loras: { path: "/sdapi/v1/loras", title: "GET /sdapi/v1/loras" },
    samplers: { path: "/sdapi/v1/samplers", title: "GET /sdapi/v1/samplers" },
    schedulers: { path: "/sdapi/v1/schedulers", title: "GET /sdapi/v1/schedulers" },
    "sd-models": { path: "/sdapi/v1/sd-models", title: "GET /sdapi/v1/sd-models" },
    options: { path: "/sdapi/v1/options", title: "GET /sdapi/v1/options" },
    capabilities: { path: "/sdcpp/v1/capabilities", title: "GET /sdcpp/v1/capabilities" }
  };

  const PERSISTED_FORM_IDS = [
    "openaiGenerationForm",
    "openaiEditForm",
    "sdapiTxt2imgForm",
    "sdapiImg2imgForm",
    "sdcppImgGenForm",
    "sdcppVidGenForm"
  ];

  const SLIDER_CONFIG = {
    width: { min: 64, max: 2048, step: 1, numberStep: 1 },
    height: { min: 64, max: 2048, step: 1, numberStep: 1 },
    steps: { min: 1, max: 100, step: 1, numberStep: 1 },
    cfg_scale: { min: 1, max: 10, step: 0.1, numberStep: 0.1 },
    batch_size: { min: 1, max: 16, step: 1, numberStep: 1 },
    denoising_strength: { min: 0.01, max: 1, step: 0.01, numberStep: 0.01 },
    sample_steps: { min: 1, max: 100, step: 1, numberStep: 1 },
    txt_cfg: { min: 1, max: 10, step: 0.1, numberStep: 0.1 },
    batch_count: { min: 1, max: 16, step: 1, numberStep: 1 },
    strength: { min: 0.01, max: 1, step: 0.01, numberStep: 0.01 }
  };

  const FIELD_LABEL_TRANSLATIONS = {
    en: {
      prompt: "Prompt",
      negative_prompt: "Negative Prompt",
      n: "Image Count",
      size: "Size",
      output_format: "Output Format",
      output_compression: "Output Compression",
      "sd_cpp_extra_args JSON": "sd_cpp_extra_args JSON",
      "image[]": "Input Images",
      mask: "Mask",
      width: "Width",
      height: "Height",
      steps: "Steps",
      cfg_scale: "CFG Scale",
      seed: "Seed",
      seed_mode: "Seed Mode",
      batch_size: "Batch Size",
      clip_skip: "CLIP Skip",
      sampler_name: "Sampler",
      scheduler: "Scheduler",
      extra_images: "Extra Images",
      "lora JSON": "LoRA JSON",
      init_images: "Init Images",
      denoising_strength: "Denoising Strength",
      inpainting_mask_invert: "Invert Mask",
      strength: "Strength",
      batch_count: "Batch Count",
      control_strength: "Control Strength",
      auto_resize_ref_image: "Auto Resize Ref Image",
      increase_ref_index: "Increase Ref Index",
      embed_image_metadata: "Embed Image Metadata",
      scm_policy_dynamic: "Dynamic SCM Policy",
      init_image: "Init Image",
      mask_image: "Mask Image",
      control_image: "Control Image",
      ref_images: "Reference Images",
      "sample_params.scheduler": "Scheduler",
      "sample_params.sample_method": "Sample Method",
      "sample_params.sample_steps": "Sample Steps",
      "sample_params.shifted_timestep": "Shifted Timestep",
      "sample_params.eta": "ETA",
      "sample_params.flow_shift": "Flow Shift",
      "sample_params.custom_sigmas": "Custom Sigmas",
      "guidance.txt_cfg": "Text CFG",
      "guidance.img_cfg": "Image CFG",
      "guidance.distilled_guidance": "Distilled Guidance",
      "guidance.slg.scale": "SLG Scale",
      "guidance.slg.layers": "SLG Layers",
      "guidance.slg.layer_start": "SLG Layer Start",
      "guidance.slg.layer_end": "SLG Layer End",
      "vae_tiling_params JSON": "VAE Tiling JSON",
      cache_mode: "Cache Mode",
      cache_option: "Cache Option",
      scm_mask: "SCM Mask",
      "Raw request JSON": "Raw Request JSON"
    },
    "zh-CN": {
      prompt: "提示词",
      negative_prompt: "负面提示词",
      n: "生成数量",
      size: "尺寸",
      output_format: "输出格式",
      output_compression: "输出压缩",
      "sd_cpp_extra_args JSON": "sd_cpp_extra_args 扩展 JSON",
      "image[]": "输入图像",
      mask: "蒙版",
      width: "宽度",
      height: "高度",
      steps: "采样步数",
      cfg_scale: "CFG 强度",
      seed: "种子",
      seed_mode: "种子模式",
      batch_size: "批量数量",
      clip_skip: "CLIP 跳层",
      sampler_name: "采样器",
      scheduler: "调度器",
      extra_images: "附加图像",
      "lora JSON": "LoRA 配置 JSON",
      init_images: "初始图像",
      denoising_strength: "重绘强度",
      inpainting_mask_invert: "蒙版反转",
      strength: "图像强度",
      batch_count: "批次数量",
      control_strength: "控制强度",
      auto_resize_ref_image: "自动缩放参考图",
      increase_ref_index: "递增参考图索引",
      embed_image_metadata: "写入图像元数据",
      scm_policy_dynamic: "动态 SCM 策略",
      init_image: "初始图像",
      mask_image: "蒙版图像",
      control_image: "控制图像",
      ref_images: "参考图像",
      "sample_params.scheduler": "调度器",
      "sample_params.sample_method": "采样方法",
      "sample_params.sample_steps": "原生采样步数",
      "sample_params.shifted_timestep": "偏移时间步",
      "sample_params.eta": "ETA",
      "sample_params.flow_shift": "Flow Shift",
      "sample_params.custom_sigmas": "自定义 Sigmas",
      "guidance.txt_cfg": "文本 CFG",
      "guidance.img_cfg": "图像 CFG",
      "guidance.distilled_guidance": "蒸馏引导",
      "guidance.slg.scale": "SLG 强度",
      "guidance.slg.layers": "SLG 层",
      "guidance.slg.layer_start": "SLG 起点",
      "guidance.slg.layer_end": "SLG 终点",
      "vae_tiling_params JSON": "VAE 切片 JSON",
      cache_mode: "缓存模式",
      cache_option: "缓存选项",
      scm_mask: "SCM 蒙版",
      "Raw request JSON": "原始请求 JSON"
    },
    "zh-TW": {
      prompt: "提示詞",
      negative_prompt: "負面提示詞",
      n: "生成數量",
      size: "尺寸",
      output_format: "輸出格式",
      output_compression: "輸出壓縮",
      "sd_cpp_extra_args JSON": "sd_cpp_extra_args 擴展 JSON",
      "image[]": "輸入圖像",
      mask: "遮罩",
      width: "寬度",
      height: "高度",
      steps: "採樣步數",
      cfg_scale: "CFG 強度",
      seed: "種子",
      seed_mode: "種子模式",
      batch_size: "批量數量",
      clip_skip: "CLIP 跳層",
      sampler_name: "採樣器",
      scheduler: "排程器",
      extra_images: "附加圖像",
      "lora JSON": "LoRA 設定 JSON",
      init_images: "初始圖像",
      denoising_strength: "重繪強度",
      inpainting_mask_invert: "遮罩反轉",
      strength: "圖像強度",
      batch_count: "批次數量",
      control_strength: "控制強度",
      auto_resize_ref_image: "自動縮放參考圖",
      increase_ref_index: "遞增參考圖索引",
      embed_image_metadata: "寫入圖像中繼資料",
      scm_policy_dynamic: "動態 SCM 策略",
      init_image: "初始圖像",
      mask_image: "遮罩圖像",
      control_image: "控制圖像",
      ref_images: "參考圖像",
      "sample_params.scheduler": "排程器",
      "sample_params.sample_method": "採樣方法",
      "sample_params.sample_steps": "原生採樣步數",
      "sample_params.shifted_timestep": "偏移時間步",
      "sample_params.eta": "ETA",
      "sample_params.flow_shift": "Flow Shift",
      "sample_params.custom_sigmas": "自定義 Sigmas",
      "guidance.txt_cfg": "文字 CFG",
      "guidance.img_cfg": "圖像 CFG",
      "guidance.distilled_guidance": "蒸餾引導",
      "guidance.slg.scale": "SLG 強度",
      "guidance.slg.layers": "SLG 層",
      "guidance.slg.layer_start": "SLG 起點",
      "guidance.slg.layer_end": "SLG 終點",
      "vae_tiling_params JSON": "VAE 切片 JSON",
      cache_mode: "快取模式",
      cache_option: "快取選項",
      scm_mask: "SCM 遮罩",
      "Raw request JSON": "原始請求 JSON"
    },
    ja: {
      prompt: "プロンプト",
      negative_prompt: "ネガティブプロンプト",
      n: "生成枚数",
      size: "サイズ",
      output_format: "出力形式",
      output_compression: "圧縮率",
      "sd_cpp_extra_args JSON": "sd_cpp_extra_args JSON",
      "image[]": "入力画像",
      mask: "マスク",
      width: "幅",
      height: "高さ",
      steps: "ステップ数",
      cfg_scale: "CFG スケール",
      seed: "シード",
      seed_mode: "シードモード",
      batch_size: "バッチサイズ",
      clip_skip: "CLIP Skip",
      sampler_name: "サンプラー",
      scheduler: "スケジューラ",
      extra_images: "追加画像",
      "lora JSON": "LoRA JSON",
      init_images: "初期画像",
      denoising_strength: "Denoising Strength",
      inpainting_mask_invert: "マスク反転",
      strength: "強度",
      batch_count: "バッチ数",
      control_strength: "制御強度",
      auto_resize_ref_image: "参照画像を自動リサイズ",
      increase_ref_index: "参照インデックス増加",
      embed_image_metadata: "画像メタデータ埋め込み",
      scm_policy_dynamic: "動的 SCM ポリシー",
      init_image: "初期画像",
      mask_image: "マスク画像",
      control_image: "制御画像",
      ref_images: "参照画像",
      "sample_params.scheduler": "スケジューラ",
      "sample_params.sample_method": "サンプル方式",
      "sample_params.sample_steps": "サンプルステップ",
      "sample_params.shifted_timestep": "Shifted Timestep",
      "sample_params.eta": "ETA",
      "sample_params.flow_shift": "Flow Shift",
      "sample_params.custom_sigmas": "Custom Sigmas",
      "guidance.txt_cfg": "Text CFG",
      "guidance.img_cfg": "Image CFG",
      "guidance.distilled_guidance": "Distilled Guidance",
      "guidance.slg.scale": "SLG Scale",
      "guidance.slg.layers": "SLG Layers",
      "guidance.slg.layer_start": "SLG Layer Start",
      "guidance.slg.layer_end": "SLG Layer End",
      "vae_tiling_params JSON": "VAE Tiling JSON",
      cache_mode: "Cache Mode",
      cache_option: "Cache Option",
      scm_mask: "SCM Mask",
      "Raw request JSON": "Raw Request JSON"
    },
    ko: {
      prompt: "프롬프트",
      negative_prompt: "네거티브 프롬프트",
      n: "생성 수",
      size: "크기",
      output_format: "출력 형식",
      output_compression: "압축률",
      "sd_cpp_extra_args JSON": "sd_cpp_extra_args JSON",
      "image[]": "입력 이미지",
      mask: "마스크",
      width: "너비",
      height: "높이",
      steps: "스텝 수",
      cfg_scale: "CFG 스케일",
      seed: "시드",
      seed_mode: "시드 모드",
      batch_size: "배치 크기",
      clip_skip: "CLIP Skip",
      sampler_name: "샘플러",
      scheduler: "스케줄러",
      extra_images: "추가 이미지",
      "lora JSON": "LoRA JSON",
      init_images: "초기 이미지",
      denoising_strength: "Denoising Strength",
      inpainting_mask_invert: "마스크 반전",
      strength: "강도",
      batch_count: "배치 수",
      control_strength: "제어 강도",
      auto_resize_ref_image: "참조 이미지 자동 크기 조정",
      increase_ref_index: "참조 인덱스 증가",
      embed_image_metadata: "이미지 메타데이터 포함",
      scm_policy_dynamic: "동적 SCM 정책",
      init_image: "초기 이미지",
      mask_image: "마스크 이미지",
      control_image: "제어 이미지",
      ref_images: "참조 이미지",
      "sample_params.scheduler": "스케줄러",
      "sample_params.sample_method": "샘플링 방식",
      "sample_params.sample_steps": "샘플 스텝",
      "sample_params.shifted_timestep": "Shifted Timestep",
      "sample_params.eta": "ETA",
      "sample_params.flow_shift": "Flow Shift",
      "sample_params.custom_sigmas": "Custom Sigmas",
      "guidance.txt_cfg": "Text CFG",
      "guidance.img_cfg": "Image CFG",
      "guidance.distilled_guidance": "Distilled Guidance",
      "guidance.slg.scale": "SLG Scale",
      "guidance.slg.layers": "SLG Layers",
      "guidance.slg.layer_start": "SLG Layer Start",
      "guidance.slg.layer_end": "SLG Layer End",
      "vae_tiling_params JSON": "VAE Tiling JSON",
      cache_mode: "캐시 모드",
      cache_option: "캐시 옵션",
      scm_mask: "SCM 마스크",
      "Raw request JSON": "원시 요청 JSON"
    }
  };

  const state = {
    settings: loadJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    gallery: loadJson(STORAGE_KEYS.gallery, []),
    discoveries: loadJson(STORAGE_KEYS.discoveries, {}),
    formValues: loadJson(STORAGE_KEYS.formValues, {}),
    connection: {
      openai: { status: "idle", detail: "" },
      sdapi: { status: "idle", detail: "" },
      sdcpp: { status: "idle", detail: "" }
    },
    latestResponse: null,
    latestResults: [],
    capabilities: null,
    gallerySelectedId: null,
    dirHandle: null,
    pollTimer: null,
    actualMode: "day",
    activeLanguage: "en"
  };

  const el = {};
  const FIELD_LABEL_SELECTOR = "form label.field > span, form label.toggle-line > span";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    cacheElements();
    primeFieldLabels();
    enhanceSliderControls();
    bindEvents();
    initFormPersistence();
    hydrateState();
    restoreFormStates();
    initSeedControls();
    applyLanguage();
    applyTheme();
    renderConnectionCards();
    renderRecentHistory();
    renderLatestResults();
    renderLatestResponse();
    renderDiscoveryPanels();
    renderCapabilitiesSummary();
    renderGallery();
    loadDirectoryHandle();
    previewSdcppPayload();
    if (state.settings.apiUrl) {
      checkConnections();
    }
    window.setInterval(() => {
      applyTheme();
      updateHeroChips();
    }, 60_000);
  }

  function cacheElements() {
    [
      "languageSelect", "paletteSelect", "modeSelect", "apiUrlInput", "autoSaveCheckbox",
      "helpBtn", "helpMenu", "settingsBtn", "settingsMenu",
      "apiUrlDot", "folderDot", "apiUrlChipText", "folderChipText", "modeChipText",
      "familyStatusCards", "recentHistoryList", "latestResultsGrid", "latestResponsePre",
      "latestResponseMeta", "discoveryPanels", "capabilitiesSummary", "galleryGrid",
      "galleryDetail", "gallerySearchInput", "toastHost", "jobIdInput", "pollIntervalInput",
      "autoPollCheckbox", "jobStatusPre", "jobStatusMeta", "sdcppPreviewPre",
      "samplerList", "schedulerList", "formatList"
    ].forEach((id) => {
      el[id] = document.getElementById(id);
    });
  }

  function bindEvents() {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => setActiveTab(button.dataset.tab));
    });

    el.helpBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePanel("help");
    });
    el.settingsBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePanel("settings");
    });
    el.helpMenu.addEventListener("click", (event) => event.stopPropagation());
    el.settingsMenu.addEventListener("click", (event) => event.stopPropagation());

    el.languageSelect.addEventListener("change", () => {
      state.settings.language = el.languageSelect.value;
      persistSettings();
      applyLanguage();
    });
    el.paletteSelect.addEventListener("change", () => {
      state.settings.palette = el.paletteSelect.value;
      persistSettings();
      applyTheme();
    });
    el.modeSelect.addEventListener("change", () => {
      state.settings.mode = el.modeSelect.value;
      persistSettings();
      applyTheme();
    });
    el.autoSaveCheckbox.addEventListener("change", () => {
      state.settings.autoSave = el.autoSaveCheckbox.checked;
      persistSettings();
    });

    document.getElementById("saveSettingsBtn").addEventListener("click", saveSettings);
    document.getElementById("checkConnectionBtn").addEventListener("click", checkConnections);
    document.getElementById("bindImgsBtn").addEventListener("click", bindImgsDirectory);
    document.getElementById("releaseImgsBtn").addEventListener("click", forgetImgsDirectory);
    document.getElementById("refreshCapabilitiesBtn").addEventListener("click", fetchCapabilities);
    document.getElementById("refreshDiscoveryBtn").addEventListener("click", refreshDiscovery);
    document.getElementById("fetchCapabilitiesBtn").addEventListener("click", fetchCapabilities);
    document.getElementById("applyCapabilitiesBtn").addEventListener("click", applyCapabilitiesDefaults);
    document.getElementById("previewSdcppJsonBtn").addEventListener("click", previewSdcppPayload);
    document.getElementById("fetchOpenaiModelsBtn").addEventListener("click", () => fetchDiscovery("models"));
    document.getElementById("saveAllResultsBtn").addEventListener("click", saveAllLatestResults);
    document.getElementById("clearLatestResultsBtn").addEventListener("click", () => {
      state.latestResults = [];
      renderLatestResults();
    });
    document.getElementById("exportGalleryBtn").addEventListener("click", exportGallery);
    document.getElementById("clearGalleryBtn").addEventListener("click", clearGallery);
    document.getElementById("pollJobBtn").addEventListener("click", () => pollJob(el.jobIdInput.value.trim(), { autoContinue: false }));
    document.getElementById("cancelJobBtn").addEventListener("click", cancelJob);
    document.getElementById("stopPollingBtn").addEventListener("click", () => stopPolling(true));
    el.gallerySearchInput.addEventListener("input", renderGallery);

    document.querySelectorAll("[data-discovery-fetch]").forEach((button) => {
      button.addEventListener("click", () => fetchDiscovery(button.dataset.discoveryFetch));
    });

    document.getElementById("openaiGenerationForm").addEventListener("submit", submitOpenAiGeneration);
    document.getElementById("openaiEditForm").addEventListener("submit", submitOpenAiEdit);
    document.getElementById("sdapiTxt2imgForm").addEventListener("submit", submitSdapiTxt2img);
    document.getElementById("sdapiImg2imgForm").addEventListener("submit", submitSdapiImg2img);
    document.getElementById("sdcppImgGenForm").addEventListener("submit", submitSdcppImgGen);
    document.getElementById("sdcppVidGenForm").addEventListener("submit", submitSdcppVidGen);
    document.getElementById("sdcppImgGenForm").addEventListener("input", previewSdcppPayload);
    document.getElementById("sdcppImgGenForm").addEventListener("change", previewSdcppPayload);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!el.helpMenu.contains(target) && !el.helpBtn.contains(target)) {
        closeHelpPanel();
      }
      if (!el.settingsMenu.contains(target) && !el.settingsBtn.contains(target)) {
        closeSettingsPanel();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closePanels();
    });
  }

  function hydrateState() {
    state.settings = { ...DEFAULT_SETTINGS, ...state.settings };
    state.capabilities = state.discoveries.capabilities || null;
    el.languageSelect.value = state.settings.language;
    el.paletteSelect.value = state.settings.palette;
    el.modeSelect.value = state.settings.mode;
    el.apiUrlInput.value = state.settings.apiUrl;
    el.autoSaveCheckbox.checked = Boolean(state.settings.autoSave);
    syncDiscoveryIntoDatalists();
    updateHeroChips();
  }

  function persistSettings() {
    safeWrite(STORAGE_KEYS.settings, state.settings);
    updateHeroChips();
  }

  function saveSettings() {
    state.settings.apiUrl = normalizeBaseUrl(el.apiUrlInput.value);
    persistSettings();
    toast("toastSuccess", "saveSettings", state.settings.apiUrl || "/");
  }

  function setActiveTab(name) {
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.tab === name));
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `tab-${name}`);
    });
  }

  function detectLanguage() {
    const source = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    const lowered = source.toLowerCase();
    if (lowered.startsWith("zh")) {
      return lowered.includes("tw") || lowered.includes("hk") || lowered.includes("mo") ? "zh-TW" : "zh-CN";
    }
    if (lowered.startsWith("ja")) return "ja";
    if (lowered.startsWith("ko")) return "ko";
    return "en";
  }

  function currentLanguage() {
    return state.settings.language === "auto" ? detectLanguage() : state.settings.language;
  }

  function t(key) {
    const dict = window.SDCPP_I18N[state.activeLanguage] || window.SDCPP_I18N.en;
    return dict[key] || window.SDCPP_I18N.en[key] || key;
  }

  function applyLanguage() {
    state.activeLanguage = currentLanguage();
    document.documentElement.lang = state.activeLanguage;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
    localizeFieldLabels();
    el.helpBtn.title = t("helpTitle");
    el.settingsBtn.title = t("settingsTitle");
    el.gallerySearchInput.placeholder = state.activeLanguage === "zh-CN"
      ? "提示词 / 接口 / 文件"
      : state.activeLanguage === "zh-TW"
        ? "提示詞 / 介面 / 檔案"
        : state.activeLanguage === "ja"
          ? "prompt / endpoint / file"
          : state.activeLanguage === "ko"
            ? "프롬프트 / 엔드포인트 / 파일"
            : "prompt / endpoint / file";
    updateHeroChips();
    renderConnectionCards();
    renderRecentHistory();
    renderLatestResults();
    renderLatestResponse();
    renderDiscoveryPanels();
    renderCapabilitiesSummary();
    renderGallery();
  }

  function primeFieldLabels() {
    document.querySelectorAll(FIELD_LABEL_SELECTOR).forEach((node) => {
      if (!node.dataset.fieldKey) node.dataset.fieldKey = node.textContent.trim();
    });
  }

  function localizeFieldLabels() {
    document.querySelectorAll(FIELD_LABEL_SELECTOR).forEach((node) => {
      const key = node.dataset.fieldKey || node.textContent.trim();
      node.textContent = formatFieldLabel(key);
    });
  }

  function formatFieldLabel(key) {
    if (!key) return "";
    const dict = FIELD_LABEL_TRANSLATIONS[state.activeLanguage] || FIELD_LABEL_TRANSLATIONS.en;
    const translated = dict[key] || FIELD_LABEL_TRANSLATIONS.en[key] || key;
    if (translated === key) return key;
    const useWideParens = ["zh-CN", "zh-TW", "ja", "ko"].includes(state.activeLanguage);
    return useWideParens ? `${translated}（${key}）` : `${translated} (${key})`;
  }

  function determineAutoMode(date = new Date()) {
    const hour = date.getHours();
    if (hour >= 7 && hour <= 16) return "day";
    if ((hour >= 5 && hour < 7) || (hour >= 17 && hour < 19)) return "twilight";
    if (hour >= 19 && hour < 23) return "night";
    return "black";
  }

  function applyTheme() {
    const palette = PALETTES[state.settings.palette] || PALETTES.blue;
    state.actualMode = state.settings.mode === "auto" ? determineAutoMode() : state.settings.mode;
    document.body.dataset.actualMode = state.actualMode;
    document.documentElement.style.setProperty("--palette-h", palette.hue);
    document.documentElement.style.setProperty("--palette-s", palette.sat);
    document.documentElement.style.setProperty("--palette-l", palette.light);
    updateHeroChips();
  }

  function togglePanel(which) {
    const helpOpen = which === "help" ? !el.helpMenu.classList.contains("on") : false;
    const settingsOpen = which === "settings" ? !el.settingsMenu.classList.contains("on") : false;
    closePanels();
    if (helpOpen) {
      el.helpMenu.classList.add("on");
      el.helpBtn.classList.add("on");
      el.helpBtn.setAttribute("aria-expanded", "true");
    }
    if (settingsOpen) {
      el.settingsMenu.classList.add("on");
      el.settingsBtn.classList.add("on");
      el.settingsBtn.setAttribute("aria-expanded", "true");
    }
  }

  function closePanels(except = "") {
    if (except !== "help") closeHelpPanel();
    if (except !== "settings") closeSettingsPanel();
  }

  function closeHelpPanel() {
    el.helpMenu.classList.remove("on");
    el.helpBtn.classList.remove("on");
    el.helpBtn.setAttribute("aria-expanded", "false");
  }

  function closeSettingsPanel() {
    el.settingsMenu.classList.remove("on");
    el.settingsBtn.classList.remove("on");
    el.settingsBtn.setAttribute("aria-expanded", "false");
  }

  function enhanceSliderControls() {
    document.querySelectorAll("form input[type='number'][name]").forEach((input) => {
      const config = SLIDER_CONFIG[input.name];
      if (!config || input.dataset.sliderReady === "1") return;
      const wrapper = document.createElement("div");
      wrapper.className = "slider-control";

      const range = document.createElement("input");
      range.type = "range";
      range.className = "slider-range";
      range.min = String(config.min);
      range.max = String(config.max);
      range.step = String(config.step);
      range.value = String(clamp(parseNum(input.value) ?? config.min, config.min, config.max));

      const meta = document.createElement("div");
      meta.className = "slider-meta";
      meta.innerHTML = `<span>${escapeHtml(formatSliderEdge(config.min, config))}</span><span>${escapeHtml(formatSliderEdge(config.max, config))}</span>`;

      input.classList.add("slider-number");
      input.min = String(config.min);
      input.max = String(config.max);
      input.step = String(config.numberStep ?? config.step);
      input.dataset.sliderReady = "1";

      input.replaceWith(wrapper);
      wrapper.append(range, input, meta);

      range.addEventListener("input", () => {
        input.value = normalizeSliderValue(config, range.value);
        dispatchSyntheticEvent(input, "input");
      });
      range.addEventListener("change", () => {
        input.value = normalizeSliderValue(config, range.value);
        dispatchSyntheticEvent(input, "change");
      });
      input.addEventListener("input", () => updateSliderPeer(input));
      input.addEventListener("change", () => {
        if (input.value !== "") input.value = normalizeSliderValue(config, input.value);
        updateSliderPeer(input);
      });
    });
  }

  function refreshSliderControls(scope = document) {
    scope.querySelectorAll("input.slider-number[name]").forEach((input) => updateSliderPeer(input));
  }

  function updateSliderPeer(input) {
    const config = SLIDER_CONFIG[input.name];
    const range = input.closest(".slider-control")?.querySelector(".slider-range");
    if (!config || !range) return;
    const value = parseNum(input.value);
    range.value = String(clamp(value ?? config.min, config.min, config.max));
  }

  function normalizeSliderFields(scope = document) {
    scope.querySelectorAll("input.slider-number[name]").forEach((input) => {
      const config = SLIDER_CONFIG[input.name];
      if (!config || input.value === "") return;
      input.value = normalizeSliderValue(config, input.value);
      updateSliderPeer(input);
    });
  }

  function normalizeSliderValue(config, value) {
    const num = parseNum(value);
    if (num === undefined) return "";
    return formatSliderEdge(clamp(num, config.min, config.max), config);
  }

  function formatSliderEdge(value, config) {
    const decimals = countStepDecimals(config.numberStep ?? config.step);
    if (!Number.isFinite(value)) return "";
    if (!decimals) return String(Math.round(value));
    return Number(value).toFixed(decimals).replace(/\.?0+$/, (match) => match === ".0" ? ".0" : "");
  }

  function countStepDecimals(step) {
    const raw = String(step ?? "");
    const pieces = raw.split(".");
    return pieces[1] ? pieces[1].length : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function dispatchSyntheticEvent(node, type) {
    node.dispatchEvent(new Event(type, { bubbles: true }));
  }

  function initFormPersistence() {
    PERSISTED_FORM_IDS.forEach((formId) => {
      const form = document.getElementById(formId);
      if (!form) return;
      const persist = (event) => {
        if (!isPersistableField(event.target)) return;
        saveFormState(form);
      };
      form.addEventListener("input", persist);
      form.addEventListener("change", persist);
      form.addEventListener("reset", () => {
        window.setTimeout(() => {
          applySeedMode(form, { refreshRandomIfNeeded: true });
          normalizeSliderFields(form);
          refreshSliderControls(form);
          saveFormState(form);
          if (form.id === "sdcppImgGenForm") previewSdcppPayload();
        }, 0);
      });
    });
  }

  function restoreFormStates() {
    PERSISTED_FORM_IDS.forEach((formId) => {
      const form = document.getElementById(formId);
      const values = state.formValues[formId];
      if (form && values) restoreFormState(form, values);
    });
  }

  function restoreFormState(form, values) {
    Object.entries(values).forEach(([name, savedValue]) => {
      const field = unwrapNamedField(form.elements.namedItem(name));
      if (!field || !isPersistableField(field)) return;
      if (field.type === "checkbox") {
        field.checked = Boolean(savedValue);
        return;
      }
      if (field.tagName === "SELECT") {
        ensureSelectHasValue(field, String(savedValue ?? ""));
        field.dataset.persistedValue = String(savedValue ?? "");
      }
      field.value = savedValue ?? "";
    });
    applySeedMode(form, { refreshRandomIfNeeded: false });
    normalizeSliderFields(form);
    refreshSliderControls(form);
  }

  function saveFormState(form) {
    if (!form?.id) return;
    state.formValues[form.id] = collectFormState(form);
    safeWrite(STORAGE_KEYS.formValues, state.formValues);
  }

  function collectFormState(form) {
    const values = {};
    [...form.elements].forEach((field) => {
      if (!isPersistableField(field) || !field.name) return;
      if (field.type === "checkbox") {
        values[field.name] = field.checked;
        return;
      }
      let value = field.value;
      if (SLIDER_CONFIG[field.name] && value !== "") {
        value = normalizeSliderValue(SLIDER_CONFIG[field.name], value);
      }
      if (field.tagName === "SELECT") {
        field.dataset.persistedValue = value ?? "";
      }
      values[field.name] = value ?? "";
    });
    return values;
  }

  function isPersistableField(field) {
    return Boolean(
      field
      && field.name
      && !field.disabled
      && field.type !== "file"
      && field.type !== "submit"
      && field.type !== "button"
      && field.type !== "reset"
      && !field.classList?.contains("slider-range")
    );
  }

  function unwrapNamedField(field) {
    if (!field) return null;
    if (field.tagName) return field;
    return field[0] || null;
  }

  function populateSelectSource(source, values) {
    const options = [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
    document.querySelectorAll(`select[data-select-source="${source}"]`).forEach((select) => {
      const current = select.dataset.persistedValue ?? select.value ?? "";
      const finalOptions = current && !options.includes(current) ? [...options, current].sort((a, b) => String(a).localeCompare(String(b))) : options;
      select.innerHTML = `<option value=""></option>${finalOptions.map((value) => `<option value="${escapeAttr(value)}">${escapeHtml(value)}</option>`).join("")}`;
      select.value = current;
    });
  }

  function ensureSelectHasValue(select, value) {
    if (!select || value === "") return;
    if (![...select.options].some((option) => option.value === value)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  }

  function initSeedControls() {
    PERSISTED_FORM_IDS.forEach((formId) => {
      const form = document.getElementById(formId);
      if (!form?.seed || !form.seed_mode) return;
      form.seed_mode.addEventListener("change", () => {
        applySeedMode(form, { refreshRandomIfNeeded: true });
        saveFormState(form);
      });
      applySeedMode(form, { refreshRandomIfNeeded: false });
      saveFormState(form);
    });
  }

  function applySeedMode(form, options = {}) {
    if (!form?.seed || !form.seed_mode) return;
    const mode = form.seed_mode.value === "fixed" ? "fixed" : "random";
    const seedInput = form.seed;
    const seedValue = resolveSeedValue(form, { refreshRandom: Boolean(options.refreshRandomIfNeeded) });
    if (seedValue !== undefined) seedInput.value = String(seedValue);
    seedInput.readOnly = mode === "random";
    seedInput.setAttribute("aria-readonly", String(mode === "random"));
    seedInput.classList.toggle("is-readonly", mode === "random");
  }

  function resolveSeedValue(form, options = {}) {
    if (!form?.seed) return undefined;
    const mode = form.seed_mode?.value === "fixed" ? "fixed" : "random";
    const current = parseNum(form.seed.value);
    if (mode === "fixed") {
      if (current !== undefined) return Math.max(0, Math.floor(current));
      return 0;
    }
    if (!options.refreshRandom && current !== undefined && current >= 0) {
      return Math.floor(current);
    }
    const generated = generateRandomSeed();
    form.seed.value = String(generated);
    return generated;
  }

  function resolveSeedForSubmission(form) {
    return resolveSeedValue(form, { refreshRandom: form.seed_mode?.value !== "fixed" });
  }

  function updateHeroChips() {
    const hasUrl = Boolean(normalizeBaseUrl(state.settings.apiUrl));
    el.apiUrlChipText.textContent = hasUrl ? state.settings.apiUrl : t("connectionIdle");
    el.apiUrlDot.className = `status-dot ${hasUrl ? "ok" : ""}`;
    el.folderChipText.textContent = state.dirHandle ? t("folderBound") : t("folderNotBound");
    el.folderDot.className = `status-dot ${state.dirHandle ? "ok" : ""}`;
    el.modeChipText.textContent = `${t("modeActual")}: ${t(`mode${capitalize(state.actualMode)}`)}`;
  }

  async function checkConnections() {
    const baseUrl = normalizeBaseUrl(el.apiUrlInput.value || state.settings.apiUrl);
    if (!baseUrl) {
      toast("toastError", "apiUrl", "API URL is required");
      return;
    }
    state.settings.apiUrl = baseUrl;
    persistSettings();

    const targets = [
      { key: "openai", path: "/v1/models" },
      { key: "sdapi", path: "/sdapi/v1/options" },
      { key: "sdcpp", path: "/sdcpp/v1/capabilities" }
    ];

    const checks = await Promise.allSettled(targets.map(async (item) => {
      const started = performance.now();
      const response = await fetch(`${baseUrl}${item.path}`);
      const elapsed = Math.round(performance.now() - started);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return { item, elapsed, status: response.status };
    }));

    checks.forEach((result, index) => {
      const key = targets[index].key;
      if (result.status === "fulfilled") {
        state.connection[key] = { status: "ok", detail: `${result.value.status} / ${result.value.elapsed} ms` };
      } else {
        state.connection[key] = { status: "bad", detail: String(result.reason?.message || result.reason) };
      }
    });
    const discoveryTasks = [];
    if (state.connection.sdapi.status === "ok") {
      discoveryTasks.push(fetchDiscovery("samplers"), fetchDiscovery("schedulers"));
    }
    if (state.connection.sdcpp.status === "ok") {
      discoveryTasks.push(fetchDiscovery("capabilities"));
    }
    if (discoveryTasks.length) {
      await Promise.allSettled(discoveryTasks);
    }
    renderConnectionCards();
    toast(Object.values(state.connection).some((item) => item.status === "ok") ? "toastSuccess" : "toastError", Object.values(state.connection).some((item) => item.status === "ok") ? "toastConnection" : "connectionFail");
  }

  function renderConnectionCards() {
    const items = [
      { key: "openai", label: t("familyOpenai"), hint: "/v1/models" },
      { key: "sdapi", label: t("familySdapi"), hint: "/sdapi/v1/options" },
      { key: "sdcpp", label: t("familySdcpp"), hint: "/sdcpp/v1/capabilities" }
    ];
    el.familyStatusCards.innerHTML = items.map((item) => {
      const info = state.connection[item.key];
      const label = info.status === "ok" ? t("connectionOk") : info.status === "bad" ? t("connectionFail") : t("connectionIdle");
      return `<article class="family-card"><div class="section-heading"><div><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.hint)}</p></div><span class="pill ${info.status === "ok" ? "ok" : info.status === "bad" ? "bad" : ""}">${escapeHtml(label)}</span></div><p>${escapeHtml(info.detail || "-")}</p></article>`;
    }).join("");
  }

  async function apiRequest(path, options = {}) {
    const baseUrl = normalizeBaseUrl(el.apiUrlInput.value || state.settings.apiUrl);
    if (!baseUrl) throw new Error("API URL is required");
    state.settings.apiUrl = baseUrl;
    persistSettings();
    const response = await fetch(`${baseUrl}${path}`, options);
    const contentType = response.headers.get("content-type") || "";
    let body;
    if (contentType.includes("application/json")) {
      body = await response.json();
    } else {
      const text = await response.text();
      try {
        body = JSON.parse(text);
      } catch (_error) {
        body = { raw: text };
      }
    }
    if (!response.ok) {
      const error = new Error(body?.error?.message || body?.message || `${response.status} ${response.statusText}`);
      error.body = body;
      throw error;
    }
    return { response, body };
  }

  function setLatestResponse(label, payload) {
    state.latestResponse = { label, payload, time: Date.now() };
    renderLatestResponse();
  }

  function renderLatestResponse() {
    if (!state.latestResponse) {
      el.latestResponseMeta.textContent = "-";
      el.latestResponsePre.textContent = "{}";
      return;
    }
    el.latestResponseMeta.textContent = `${state.latestResponse.label} · ${formatTime(state.latestResponse.time)}`;
    el.latestResponsePre.textContent = JSON.stringify(state.latestResponse.payload, null, 2);
  }

  async function fetchDiscovery(key) {
    const config = DISCOVERY[key];
    if (!config) return;
    try {
      const { body } = await apiRequest(config.path, { method: "GET" });
      state.discoveries[key] = body;
      if (key === "capabilities") state.capabilities = body;
      safeWrite(STORAGE_KEYS.discoveries, state.discoveries);
      syncDiscoveryIntoDatalists();
      renderDiscoveryPanels();
      renderCapabilitiesSummary();
      setLatestResponse(config.title, body);
    } catch (error) {
      handleError(config.title, error);
    }
  }

  async function refreshDiscovery() {
    for (const key of ["models", "loras", "samplers", "schedulers", "sd-models", "options"]) {
      await fetchDiscovery(key);
    }
  }

  async function fetchCapabilities() {
    await fetchDiscovery("capabilities");
  }

  function syncDiscoveryIntoDatalists() {
    const samplers = new Set();
    const schedulers = new Set();
    const formats = new Set(["png", "jpeg", "webp"]);
    (state.discoveries.samplers || []).forEach((item) => item?.name && samplers.add(item.name));
    (state.discoveries.schedulers || []).forEach((item) => item?.name && schedulers.add(item.name));
    (state.capabilities?.samplers || []).forEach((item) => samplers.add(item));
    (state.capabilities?.schedulers || []).forEach((item) => schedulers.add(item));
    (state.capabilities?.output_formats || []).forEach((item) => formats.add(item));
    fillDatalist(el.samplerList, [...samplers]);
    fillDatalist(el.schedulerList, [...schedulers]);
    fillDatalist(el.formatList, [...formats]);
    populateSelectSource("samplers", [...samplers]);
    populateSelectSource("schedulers", [...schedulers]);
  }

  function fillDatalist(node, values) {
    if (!node) return;
    node.innerHTML = values.sort().map((value) => `<option value="${escapeAttr(value)}"></option>`).join("");
  }

  function renderDiscoveryPanels() {
    const keys = ["models", "loras", "samplers", "schedulers", "sd-models", "options", "capabilities"];
    el.discoveryPanels.innerHTML = keys.map((key) => {
      const data = state.discoveries[key];
      return `<article class="discovery-card"><div class="section-heading"><div><h4>${escapeHtml(DISCOVERY[key]?.title || key)}</h4><p>${escapeHtml(summary(data))}</p></div><button class="tag-button" type="button" data-discovery-card="${escapeAttr(key)}">${escapeHtml(t("sendRequest"))}</button></div>${previewBlock(data)}</article>`;
    }).join("");
    el.discoveryPanels.querySelectorAll("[data-discovery-card]").forEach((button) => {
      button.addEventListener("click", () => fetchDiscovery(button.dataset.discoveryCard));
    });
  }

  function previewBlock(data) {
    if (!data) return `<div class="empty-state">${escapeHtml(t("noData"))}</div>`;
    if (Array.isArray(data) && data.length && typeof data[0] === "object") {
      const keys = [...new Set(data.flatMap((item) => Object.keys(item).slice(0, 6)))].slice(0, 6);
      const rows = data.slice(0, 8).map((item) => `<tr>${keys.map((key) => `<td>${escapeHtml(short(item[key]))}</td>`).join("")}</tr>`).join("");
      return `<div class="response-box"><table><thead><tr>${keys.map((key) => `<th>${escapeHtml(key)}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    return `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
  }

  function renderCapabilitiesSummary() {
    if (!state.capabilities) {
      el.capabilitiesSummary.innerHTML = `<div class="empty-state">${escapeHtml(t("noData"))}</div>`;
      return;
    }
    const caps = state.capabilities;
    const blocks = [
      { title: "Model", content: `${caps.model?.stem || caps.model?.name || "-"}\n${caps.model?.path || ""}` },
      { title: "Defaults", content: `${caps.defaults?.width || "-"} × ${caps.defaults?.height || "-"}\nsteps: ${caps.defaults?.sample_params?.sample_steps ?? "-"}` },
      { title: "Limits", content: caps.limits ? `w ${caps.limits.min_width}-${caps.limits.max_width}\nh ${caps.limits.min_height}-${caps.limits.max_height}\nqueue ${caps.limits.max_queue_size}` : "-" },
      { title: "Features", content: caps.features ? Object.entries(caps.features).filter(([, value]) => value).map(([key]) => key).join(", ") || "-" : "-" }
    ];
    el.capabilitiesSummary.innerHTML = blocks.map((item) => `<article class="info-card"><h4>${escapeHtml(item.title)}</h4><pre>${escapeHtml(item.content)}</pre></article>`).join("");
  }

  function applyCapabilitiesDefaults() {
    const defaults = state.capabilities?.defaults;
    const form = document.getElementById("sdcppImgGenForm");
    if (!defaults) {
      toast("toastInfo", "fetchCapabilities");
      return;
    }
    assign(form.prompt, defaults.prompt);
    assign(form.negative_prompt, defaults.negative_prompt);
    assign(form.clip_skip, defaults.clip_skip);
    assign(form.width, defaults.width);
    assign(form.height, defaults.height);
    assign(form.strength, defaults.strength);
    if (form.seed_mode) {
      form.seed_mode.value = Number.isFinite(Number(defaults.seed)) && Number(defaults.seed) >= 0 ? "fixed" : "random";
    }
    if (Number.isFinite(Number(defaults.seed)) && Number(defaults.seed) >= 0) {
      assign(form.seed, defaults.seed);
    }
    assign(form.batch_count, defaults.batch_count);
    assign(form.control_strength, defaults.control_strength);
    assign(form.output_format, defaults.output_format || "png");
    assign(form.output_compression, defaults.output_compression || 100);
    form.auto_resize_ref_image.checked = Boolean(defaults.auto_resize_ref_image);
    form.increase_ref_index.checked = Boolean(defaults.increase_ref_index);
    form.embed_image_metadata.checked = defaults.embed_image_metadata !== false;
    form.scm_policy_dynamic.checked = defaults.scm_policy_dynamic !== false;
    assign(form.scheduler, defaults.sample_params?.scheduler || "");
    assign(form.sample_method, defaults.sample_params?.sample_method || "");
    assign(form.sample_steps, defaults.sample_params?.sample_steps);
    assign(form.eta, defaults.sample_params?.eta || "");
    assign(form.shifted_timestep, defaults.sample_params?.shifted_timestep || 0);
    assign(form.flow_shift, defaults.sample_params?.flow_shift || "");
    assign(form.txt_cfg, defaults.sample_params?.guidance?.txt_cfg);
    assign(form.img_cfg, defaults.sample_params?.guidance?.img_cfg || "");
    assign(form.distilled_guidance, defaults.sample_params?.guidance?.distilled_guidance);
    assign(form.slg_layers, (defaults.sample_params?.guidance?.slg?.layers || []).join(", "));
    assign(form.slg_start, defaults.sample_params?.guidance?.slg?.layer_start);
    assign(form.slg_end, defaults.sample_params?.guidance?.slg?.layer_end);
    assign(form.slg_scale, defaults.sample_params?.guidance?.slg?.scale);
    if (defaults.vae_tiling_params) {
      form.vae_tiling_json.value = JSON.stringify(defaults.vae_tiling_params, null, 2);
    }
    assign(form.cache_mode, defaults.cache_mode || "disabled");
    assign(form.cache_option, defaults.cache_option || "");
    assign(form.scm_mask, defaults.scm_mask || "");
    applySeedMode(form, { refreshRandomIfNeeded: true });
    normalizeSliderFields(form);
    refreshSliderControls(form);
    saveFormState(form);
    previewSdcppPayload();
  }

  function assign(field, value) {
    if (!field || value === undefined || value === null) return;
    if (field.tagName === "SELECT") {
      ensureSelectHasValue(field, String(value));
      field.dataset.persistedValue = String(value);
      field.value = String(value);
      return;
    }
    field.value = value;
  }

  function parseNum(value) {
    if (value === "" || value === undefined || value === null) return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  }

  function parseJson(text, fallback = undefined) {
    const trimmed = (text || "").trim();
    if (!trimmed) return fallback;
    return JSON.parse(trimmed);
  }

  function parseCsvNumbers(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return undefined;
    return trimmed.split(/[\s,]+/).filter(Boolean).map(Number).filter((value) => Number.isFinite(value));
  }

  function promptWithExtra(prompt, extra) {
    const trimmed = (extra || "").trim();
    if (!trimmed) return prompt.trim();
    return `${prompt.trim()} <sd_cpp_extra_args>${JSON.stringify(JSON.parse(trimmed))}</sd_cpp_extra_args>`;
  }

  function removeUndefined(obj) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value === undefined) delete obj[key];
      else if (value && typeof value === "object" && !Array.isArray(value)) {
        removeUndefined(value);
        if (!Object.keys(value).length) delete obj[key];
      }
    });
    return obj;
  }

  async function submitOpenAiGeneration(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const payload = {
        prompt: promptWithExtra(form.prompt.value, form.extra_args.value),
        n: parseNum(form.n.value) || 1,
        size: form.size.value.trim() || "1024x1024",
        output_format: form.output_format.value,
        output_compression: parseNum(form.output_compression.value) || 100
      };
      const { body } = await apiRequest("/v1/images/generations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setLatestResponse("POST /v1/images/generations", body);
      const format = body.output_format || payload.output_format || "png";
      const images = (body.data || []).map((item, index) => ({ id: `${Date.now()}-${index}`, dataUrl: `data:image/${format};base64,${item.b64_json}`, format }));
      await absorbResults(images, { apiFamily: "openai", endpoint: "/v1/images/generations", parameters: payload, created: (body.created || Math.floor(Date.now() / 1000)) * 1000 });
    } catch (error) {
      handleError("POST /v1/images/generations", error);
    }
  }

  async function submitOpenAiEdit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const payload = new FormData();
      payload.append("prompt", promptWithExtra(form.prompt.value, form.extra_args.value));
      [...form.image_files.files].forEach((file) => payload.append("image[]", file, file.name));
      if (form.mask.files[0]) payload.append("mask", form.mask.files[0], form.mask.files[0].name);
      payload.append("n", String(parseNum(form.n.value) || 1));
      payload.append("size", form.size.value.trim() || "1024x1024");
      payload.append("output_format", form.output_format.value);
      payload.append("output_compression", String(parseNum(form.output_compression.value) || 100));
      const { body } = await apiRequest("/v1/images/edits", { method: "POST", body: payload });
      setLatestResponse("POST /v1/images/edits", body);
      const format = body.output_format || form.output_format.value || "png";
      const images = (body.data || []).map((item, index) => ({ id: `${Date.now()}-${index}`, dataUrl: `data:image/${format};base64,${item.b64_json}`, format }));
      await absorbResults(images, { apiFamily: "openai", endpoint: "/v1/images/edits", parameters: { prompt: form.prompt.value, size: form.size.value }, created: (body.created || Math.floor(Date.now() / 1000)) * 1000 });
    } catch (error) {
      handleError("POST /v1/images/edits", error);
    }
  }

  async function submitSdapiTxt2img(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const resolvedSeed = resolveSeedForSubmission(form);
      applySeedMode(form, { refreshRandomIfNeeded: false });
      normalizeSliderFields(form);
      saveFormState(form);
      const payload = removeUndefined({
        prompt: promptWithExtra(form.prompt.value, form.extra_args.value),
        negative_prompt: form.negative_prompt.value,
        width: parseNum(form.width.value),
        height: parseNum(form.height.value),
        steps: parseNum(form.steps.value),
        cfg_scale: parseNum(form.cfg_scale.value),
        seed: resolvedSeed,
        batch_size: parseNum(form.batch_size.value),
        clip_skip: parseNum(form.clip_skip.value),
        sampler_name: form.sampler_name.value.trim() || undefined,
        scheduler: form.scheduler.value.trim() || undefined,
        lora: parseJson(form.lora_json.value, undefined),
        extra_images: await filesToDataUrls(form.extra_images_files.files)
      });
      if (!payload.extra_images?.length) delete payload.extra_images;
      const { body } = await apiRequest("/sdapi/v1/txt2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setLatestResponse("POST /sdapi/v1/txt2img", body);
      const images = (body.images || []).map((b64, index) => ({ id: `${Date.now()}-${index}`, dataUrl: toDataUrl("png", b64), format: "png" }));
      await absorbResults(images, { apiFamily: "sdapi", endpoint: "/sdapi/v1/txt2img", parameters: body.parameters || payload, created: Date.now() });
    } catch (error) {
      handleError("POST /sdapi/v1/txt2img", error);
    }
  }

  async function submitSdapiImg2img(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const resolvedSeed = resolveSeedForSubmission(form);
      applySeedMode(form, { refreshRandomIfNeeded: false });
      normalizeSliderFields(form);
      saveFormState(form);
      const payload = removeUndefined({
        prompt: promptWithExtra(form.prompt.value, form.extra_args.value),
        negative_prompt: form.negative_prompt.value,
        init_images: await filesToDataUrls(form.init_images_files.files),
        mask: (await fileToDataUrl(form.mask_file.files[0])) || undefined,
        width: parseNum(form.width.value),
        height: parseNum(form.height.value),
        steps: parseNum(form.steps.value),
        cfg_scale: parseNum(form.cfg_scale.value),
        seed: resolvedSeed,
        batch_size: parseNum(form.batch_size.value),
        denoising_strength: parseNum(form.denoising_strength.value),
        inpainting_mask_invert: parseNum(form.inpainting_mask_invert.value),
        clip_skip: parseNum(form.clip_skip.value),
        sampler_name: form.sampler_name.value.trim() || undefined,
        scheduler: form.scheduler.value.trim() || undefined,
        lora: parseJson(form.lora_json.value, undefined)
      });
      const { body } = await apiRequest("/sdapi/v1/img2img", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setLatestResponse("POST /sdapi/v1/img2img", body);
      const images = (body.images || []).map((b64, index) => ({ id: `${Date.now()}-${index}`, dataUrl: toDataUrl("png", b64), format: "png" }));
      await absorbResults(images, { apiFamily: "sdapi", endpoint: "/sdapi/v1/img2img", parameters: body.parameters || payload, created: Date.now() });
    } catch (error) {
      handleError("POST /sdapi/v1/img2img", error);
    }
  }

  async function buildSdcppPayload() {
    const form = document.getElementById("sdcppImgGenForm");
    const payload = {
      prompt: form.prompt.value.trim(),
      negative_prompt: form.negative_prompt.value,
      clip_skip: parseNum(form.clip_skip.value),
      width: parseNum(form.width.value),
      height: parseNum(form.height.value),
      strength: parseNum(form.strength.value),
      seed: resolveSeedValue(form, { refreshRandom: false }),
      batch_count: parseNum(form.batch_count.value),
      auto_resize_ref_image: form.auto_resize_ref_image.checked,
      increase_ref_index: form.increase_ref_index.checked,
      control_strength: parseNum(form.control_strength.value),
      embed_image_metadata: form.embed_image_metadata.checked,
      init_image: (await fileToDataUrl(form.init_image_file.files[0])) || null,
      ref_images: await filesToDataUrls(form.ref_images_files.files),
      mask_image: (await fileToDataUrl(form.mask_image_file.files[0])) || null,
      control_image: (await fileToDataUrl(form.control_image_file.files[0])) || null,
      lora: parseJson(form.lora_json.value, []),
      vae_tiling_params: parseJson(form.vae_tiling_json.value, undefined),
      cache_mode: form.cache_mode.value.trim() || undefined,
      cache_option: form.cache_option.value.trim() || "",
      scm_mask: form.scm_mask.value.trim() || "",
      scm_policy_dynamic: form.scm_policy_dynamic.checked,
      output_format: form.output_format.value.trim() || "png",
      output_compression: parseNum(form.output_compression.value),
      sample_params: {
        sample_steps: parseNum(form.sample_steps.value),
        shifted_timestep: parseNum(form.shifted_timestep.value),
        custom_sigmas: parseCsvNumbers(form.custom_sigmas.value) || [],
        guidance: {
          txt_cfg: parseNum(form.txt_cfg.value),
          distilled_guidance: parseNum(form.distilled_guidance.value),
          slg: {
            layers: parseCsvNumbers(form.slg_layers.value) || [],
            layer_start: parseNum(form.slg_start.value),
            layer_end: parseNum(form.slg_end.value),
            scale: parseNum(form.slg_scale.value)
          }
        }
      }
    };
    if (form.scheduler.value.trim()) payload.sample_params.scheduler = form.scheduler.value.trim();
    if (form.sample_method.value.trim()) payload.sample_params.sample_method = form.sample_method.value.trim();
    if (form.eta.value.trim()) payload.sample_params.eta = Number(form.eta.value);
    if (form.flow_shift.value.trim()) payload.sample_params.flow_shift = Number(form.flow_shift.value);
    if (form.img_cfg.value.trim()) payload.sample_params.guidance.img_cfg = Number(form.img_cfg.value);
    return removeUndefined(payload);
  }

  async function previewSdcppPayload() {
    try {
      const payload = await buildSdcppPayload();
      el.sdcppPreviewPre.textContent = JSON.stringify(payload, null, 2);
    } catch (error) {
      el.sdcppPreviewPre.textContent = JSON.stringify({ error: error.message }, null, 2);
    }
  }

  async function submitSdcppImgGen(event) {
    event.preventDefault();
    try {
      const form = event.currentTarget;
      resolveSeedForSubmission(form);
      applySeedMode(form, { refreshRandomIfNeeded: false });
      normalizeSliderFields(form);
      saveFormState(form);
      const payload = await buildSdcppPayload();
      const { body } = await apiRequest("/sdcpp/v1/img_gen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setLatestResponse("POST /sdcpp/v1/img_gen", body);
      el.jobIdInput.value = body.id || "";
      if (body.id) {
        await pollJob(body.id, { autoContinue: el.autoPollCheckbox.checked, initialPayload: payload });
      }
    } catch (error) {
      handleError("POST /sdcpp/v1/img_gen", error);
    }
  }

  async function submitSdcppVidGen(event) {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const payload = JSON.parse(form.raw_json.value);
      const { body } = await apiRequest("/sdcpp/v1/vid_gen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setLatestResponse("POST /sdcpp/v1/vid_gen", body);
    } catch (error) {
      handleError("POST /sdcpp/v1/vid_gen", error);
    }
  }

  async function pollJob(jobId, options = {}) {
    const id = jobId.trim();
    if (!id) {
      toast("toastError", "jobId", "Job ID is required");
      return;
    }
    stopPolling(false);
    const loop = async () => {
      try {
        const { body } = await apiRequest(`/sdcpp/v1/jobs/${encodeURIComponent(id)}`, { method: "GET" });
        setLatestResponse(`GET /sdcpp/v1/jobs/${id}`, body);
        el.jobStatusMeta.textContent = `${id} · ${formatTime(Date.now())}`;
        el.jobStatusPre.textContent = JSON.stringify(body, null, 2);
        if (body.status === "completed" && body.result?.images) {
          const format = body.result.output_format || "png";
          const images = body.result.images.map((item, index) => ({ id: `${id}-${index}`, dataUrl: `data:image/${format};base64,${item.b64_json}`, format }));
          await absorbResults(images, { apiFamily: "sdcpp", endpoint: "/sdcpp/v1/jobs/{id}", parameters: options.initialPayload || tryJson(el.sdcppPreviewPre.textContent) || {}, created: (body.completed || Math.floor(Date.now() / 1000)) * 1000, jobId: id });
          stopPolling(false);
          return;
        }
        if (["failed", "cancelled"].includes(body.status)) {
          stopPolling(false);
          return;
        }
        if (options.autoContinue) {
          state.pollTimer = window.setTimeout(loop, Math.max(1, parseNum(el.pollIntervalInput.value) || 2) * 1000);
        }
      } catch (error) {
        handleError(`GET /sdcpp/v1/jobs/${id}`, error);
        stopPolling(false);
      }
    };
    await loop();
  }

  async function cancelJob() {
    const id = el.jobIdInput.value.trim();
    if (!id) {
      toast("toastError", "jobId", "Job ID is required");
      return;
    }
    try {
      const { body } = await apiRequest(`/sdcpp/v1/jobs/${encodeURIComponent(id)}/cancel`, { method: "POST", headers: { "Content-Type": "application/json" } });
      setLatestResponse(`POST /sdcpp/v1/jobs/${id}/cancel`, body);
      el.jobStatusMeta.textContent = `${id} · ${formatTime(Date.now())}`;
      el.jobStatusPre.textContent = JSON.stringify(body, null, 2);
      stopPolling(false);
    } catch (error) {
      handleError(`POST /sdcpp/v1/jobs/${id}/cancel`, error);
    }
  }

  function stopPolling(showToast) {
    if (state.pollTimer) {
      window.clearTimeout(state.pollTimer);
      state.pollTimer = null;
    }
    if (showToast) toast("toastInfo", "stopPolling");
  }

  async function absorbResults(results, meta) {
    state.latestResults = results.map((item, index) => ({ ...item, meta, index, saved: false }));
    renderLatestResults();
    for (const result of state.latestResults) {
      const entry = {
        id: randomId(),
        createdAt: meta.created || Date.now(),
        apiFamily: meta.apiFamily,
        endpoint: meta.endpoint,
        prompt: meta.parameters?.prompt || "",
        parameters: meta.parameters || {},
        fileName: "",
        format: result.format || "png",
        saved: false,
        thumbDataUrl: await createThumbnail(result.dataUrl),
        jobId: meta.jobId || ""
      };
      state.gallery.unshift(entry);
      result.galleryId = entry.id;
      if (state.settings.autoSave) {
        const saved = await saveResultToDirectory(result, entry);
        entry.saved = saved.saved;
        entry.fileName = saved.fileName || "";
        result.saved = entry.saved;
      }
    }
    state.gallery = state.gallery.slice(0, GALLERY_LIMIT);
    safeWrite(STORAGE_KEYS.gallery, state.gallery);
    renderGallery();
    renderRecentHistory();
    renderLatestResults();
    if (state.settings.autoSave && !state.dirHandle) toast("toastInfo", "toastAutosaveSkipped");
  }

  function renderLatestResults() {
    if (!state.latestResults.length) {
      el.latestResultsGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("noResults"))}</div>`;
      return;
    }
    el.latestResultsGrid.innerHTML = state.latestResults.map((item, index) => `<article class="result-card"><img src="${item.dataUrl}" alt="result ${index + 1}"><div class="content"><div class="meta"><span class="pill">${escapeHtml(item.meta.apiFamily)}</span><span class="pill ${item.saved ? "ok" : ""}">${escapeHtml(item.saved ? t("savedLabel") : t("pendingLabel"))}</span></div><h5>${escapeHtml(item.meta.endpoint)}</h5><p>${escapeHtml(cleanPromptText(item.meta.parameters?.prompt || "").slice(0, 120))}</p><div class="toolbar"><button class="tag-button" type="button" data-save-latest="${index}">${escapeHtml(t("saveImage"))}</button><button class="tag-button" type="button" data-download-latest="${index}">${escapeHtml(t("downloadImage"))}</button><button class="tag-button" type="button" data-share-latest="${index}">${escapeHtml(t("shareCard"))}</button><button class="tag-button" type="button" data-open-gallery="${escapeAttr(item.galleryId || "")}">${escapeHtml(t("openInGallery"))}</button></div></div></article>`).join("");
    el.latestResultsGrid.querySelectorAll("[data-save-latest]").forEach((button) => button.addEventListener("click", () => saveLatestResultByIndex(Number(button.dataset.saveLatest))));
    el.latestResultsGrid.querySelectorAll("[data-download-latest]").forEach((button) => button.addEventListener("click", () => downloadLatestResultByIndex(Number(button.dataset.downloadLatest))));
    el.latestResultsGrid.querySelectorAll("[data-share-latest]").forEach((button) => button.addEventListener("click", () => shareLatestResultByIndex(Number(button.dataset.shareLatest))));
    el.latestResultsGrid.querySelectorAll("[data-open-gallery]").forEach((button) => button.addEventListener("click", () => openGalleryEntry(button.dataset.openGallery)));
  }

  async function saveAllLatestResults() {
    for (let index = 0; index < state.latestResults.length; index += 1) {
      await saveLatestResultByIndex(index);
    }
  }

  async function saveLatestResultByIndex(index) {
    const result = state.latestResults[index];
    if (!result) return;
    const entry = state.gallery.find((item) => item.id === result.galleryId);
    const saved = await saveResultToDirectory(result, entry);
    if (entry) {
      entry.saved = saved.saved;
      entry.fileName = saved.fileName || entry.fileName;
    }
    result.saved = saved.saved;
    safeWrite(STORAGE_KEYS.gallery, state.gallery);
    renderLatestResults();
    renderGallery();
    renderRecentHistory();
  }

  function downloadLatestResultByIndex(index) {
    const result = state.latestResults[index];
    if (!result) return;
    triggerDownload(result.dataUrl, createFileName(result.meta, index, result.format || "png"));
  }

  async function shareLatestResultByIndex(index) {
    const result = state.latestResults[index];
    if (!result) return;
    const entry = state.gallery.find((item) => item.id === result.galleryId) || {
      createdAt: result.meta.created || Date.now(),
      apiFamily: result.meta.apiFamily,
      endpoint: result.meta.endpoint,
      prompt: result.meta.parameters?.prompt || "",
      parameters: result.meta.parameters || {},
      fileName: result.fileName || createFileName(result.meta, index, result.format || "png"),
      format: result.format || "png"
    };
    await exportShareCard(entry, result.dataUrl);
  }

  async function saveResultToDirectory(result, entry) {
    const handle = await ensureDirectoryHandle();
    if (!handle) return { saved: false, fileName: "" };
    const fileName = entry.fileName || createFileName(entry, result.index || 0, entry.format || result.format || "png");
    const imageHandle = await handle.getFileHandle(fileName, { create: true });
    const imageWritable = await imageHandle.createWritable();
    await imageWritable.write(await dataUrlToBlob(result.dataUrl));
    await imageWritable.close();
    const metaHandle = await handle.getFileHandle(fileName.replace(/\.[^.]+$/, ".json"), { create: true });
    const metaWritable = await metaHandle.createWritable();
    await metaWritable.write(JSON.stringify({
      apiFamily: entry.apiFamily,
      endpoint: entry.endpoint,
      createdAt: entry.createdAt,
      prompt: entry.prompt,
      parameters: entry.parameters,
      format: entry.format,
      jobId: entry.jobId || ""
    }, null, 2));
    await metaWritable.close();
    toast("toastSaved", fileName);
    return { saved: true, fileName };
  }

  function createFileName(meta, index, format) {
    const stamp = new Date(meta.createdAt || Date.now()).toISOString().replace(/[:.]/g, "-");
    const family = (meta.apiFamily || "api").replace(/[^a-z0-9]+/gi, "_");
    const endpoint = (meta.endpoint || "result").replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    return `${stamp}__${family}__${endpoint}__${index}.${format}`;
  }

  function renderRecentHistory() {
    const items = state.gallery.slice(0, 8);
    el.recentHistoryList.innerHTML = items.length
      ? items.map((item) => `<div class="history-row"><strong>${escapeHtml(item.endpoint)}</strong><span>${escapeHtml((item.prompt || "").slice(0, 110) || "-")}</span><code>${escapeHtml(formatTime(item.createdAt))}${item.fileName ? ` · ${escapeHtml(item.fileName)}` : ""}</code></div>`).join("")
      : `<div class="empty-state">${escapeHtml(t("recentEmpty"))}</div>`;
  }

  function renderGallery() {
    const query = (el.gallerySearchInput.value || "").trim().toLowerCase();
    const items = state.gallery.filter((item) => !query || [item.prompt, item.endpoint, item.fileName, item.apiFamily].join(" ").toLowerCase().includes(query));
    if (!items.length) {
      el.galleryGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("noGallery"))}</div>`;
      el.galleryDetail.innerHTML = `<div class="empty-state">${escapeHtml(t("galleryDetailHint"))}</div>`;
      return;
    }
    if (!state.gallerySelectedId || !items.some((item) => item.id === state.gallerySelectedId)) {
      state.gallerySelectedId = items[0].id;
    }
    el.galleryGrid.innerHTML = items.map((item) => `<article class="gallery-card ${item.id === state.gallerySelectedId ? "active" : ""}" data-gallery-id="${escapeAttr(item.id)}"><img src="${item.thumbDataUrl}" alt="${escapeAttr(item.prompt || item.endpoint)}"><div class="content"><div class="meta"><span class="pill">${escapeHtml(item.apiFamily)}</span><span class="pill ${item.saved ? "ok" : ""}">${escapeHtml(item.saved ? t("savedLabel") : t("pendingLabel"))}</span></div><h5>${escapeHtml(item.endpoint)}</h5><p>${escapeHtml((item.prompt || "").slice(0, 80))}</p></div></article>`).join("");
    el.galleryGrid.querySelectorAll("[data-gallery-id]").forEach((card) => card.addEventListener("click", () => openGalleryEntry(card.dataset.galleryId)));
    renderGalleryDetail();
  }

  async function openGalleryEntry(id) {
    state.gallerySelectedId = id;
    renderGallery();
  }

  async function renderGalleryDetail() {
    const entry = state.gallery.find((item) => item.id === state.gallerySelectedId);
    if (!entry) {
      el.galleryDetail.innerHTML = `<div class="empty-state">${escapeHtml(t("galleryDetailHint"))}</div>`;
      return;
    }
    const src = await resolveGalleryImage(entry);
    el.galleryDetail.innerHTML = `<div class="gallery-preview"><img src="${src}" alt="${escapeAttr(entry.prompt || entry.endpoint)}"></div><div class="section-heading" style="margin-top:1rem;"><div><h4>${escapeHtml(entry.endpoint)}</h4><p>${escapeHtml(cleanPromptText(entry.prompt || "-"))}</p></div><span class="pill ${entry.saved ? "ok" : ""}">${escapeHtml(entry.saved ? t("savedLabel") : t("pendingLabel"))}</span></div><div class="mini-grid"><div class="info-card"><h4>${escapeHtml(t("createdLabel"))}</h4><p>${escapeHtml(formatTime(entry.createdAt))}</p></div><div class="info-card"><h4>${escapeHtml(t("fileLabel"))}</h4><p>${escapeHtml(entry.fileName || "-")}</p></div></div><div class="toolbar" style="margin-top:1rem;"><button class="tag-button" type="button" id="openSavedFileBtn">${escapeHtml(t("openSavedFile"))}</button><button class="tag-button" type="button" id="shareGalleryCardBtn">${escapeHtml(t("shareCard"))}</button></div><div style="margin-top:1rem;"><h4>${escapeHtml(t("paramsLabel"))}</h4><pre>${escapeHtml(JSON.stringify(entry.parameters || {}, null, 2))}</pre></div>`;
    document.getElementById("openSavedFileBtn").addEventListener("click", () => openSavedFile(entry));
    document.getElementById("shareGalleryCardBtn").addEventListener("click", () => shareGalleryEntry(entry));
  }

  async function resolveGalleryImage(entry) {
    if (entry.saved && entry.fileName && state.dirHandle) {
      try {
        const handle = await ensureDirectoryHandle(false);
        if (handle) {
          const fileHandle = await handle.getFileHandle(entry.fileName);
          return URL.createObjectURL(await fileHandle.getFile());
        }
      } catch (_error) {
        return entry.thumbDataUrl;
      }
    }
    return entry.thumbDataUrl;
  }

  async function openSavedFile(entry) {
    const src = await resolveGalleryImage(entry);
    window.open(src, "_blank", "noopener");
  }

  async function shareGalleryEntry(entry) {
    const src = await resolveGalleryImage(entry);
    await exportShareCard(entry, src);
  }

  function cleanPromptText(text) {
    return String(text || "").replace(/<sd_cpp_extra_args>[\s\S]*?<\/sd_cpp_extra_args>/g, "").trim();
  }

  function buildShareSummary(entry) {
    const params = entry.parameters || {};
    const size = typeof params.size === "string" ? params.size.toLowerCase().replace("x", " × ") : "";
    const width = params.width || params.parameters?.width;
    const height = params.height || params.parameters?.height;
    const resolution = width && height ? `${width} × ${height}` : size || "";
    const model = params.model || state.capabilities?.model?.stem || state.discoveries.options?.sd_model_checkpoint || "sd-cpp-local";
    const modelVersion = params.scheduler || params.sample_params?.scheduler || params.output_format || entry.endpoint;
    const steps = params.steps || params.sample_params?.sample_steps || "";
    const sampler = params.sampler_name || params.sample_params?.sample_method || "";
    const cfg = params.cfg_scale || params.sample_params?.guidance?.txt_cfg || "";
    const seed = params.seed ?? "";
    const negative = cleanPromptText(params.negative_prompt || "");
    return {
      fileName: entry.fileName || `${entry.apiFamily || "result"}_image`,
      source: `${(entry.apiFamily || "").toUpperCase()} · ${entry.endpoint || ""}`.trim(),
      model,
      modelVersion,
      resolution,
      steps: String(steps || "—"),
      sampler: sampler || "—",
      cfg: cfg === "" ? "—" : String(cfg),
      seed: seed === "" ? "—" : String(seed),
      format: entry.format || params.output_format || "png",
      prompt: cleanPromptText(entry.prompt || params.prompt || ""),
      negative: negative || "—",
      createdAt: entry.createdAt || Date.now()
    };
  }

  async function exportShareCard(entry, previewSrc) {
    const summary = buildShareSummary(entry);
    const styles = getComputedStyle(document.body);
    const bg = styles.getPropertyValue("--bg").trim() || "#f5f7fb";
    const surface = styles.getPropertyValue("--surface").trim() || "#ffffff";
    const surface2 = styles.getPropertyValue("--surface2").trim() || "#f3f4f6";
    const primary = styles.getPropertyValue("--primary").trim() || "#4f8cff";
    const primaryDark = styles.getPropertyValue("--primary-dark").trim() || primary;
    const text = styles.getPropertyValue("--text-main").trim() || "#111827";
    const textSoft = styles.getPropertyValue("--text-soft").trim() || "#6b7280";
    const border = styles.getPropertyValue("--border").trim() || "#d1d5db";

    const outerW = 1400;
    const scale = 2;
    const cardX = 52;
    const cardY = 40;
    const cardW = outerW - 104;
    const imgX = 54;
    const imgY = 188;
    const imgBox = 314;
    const rightX = imgX + imgBox + 28;
    const topY = imgY;
    const fieldW = 418;
    const fieldH = 94;
    const gap = 14;
    const promptX = imgX;
    const promptW = cardW - 108;
    const promptY = topY + fieldH * 4 + gap * 3 + 44;
    const promptLineHeight = 24;
    const promptLines = wrapCanvasLines(cleanPromptText(summary.prompt || "—"), promptW - 40, '600 18px Nunito, sans-serif', 10);
    const negativeLines = wrapCanvasLines(cleanPromptText(summary.negative || "—"), promptW - 40, '600 18px Nunito, sans-serif', 8);
    const prompt1H = Math.max(128, 88 + promptLines.length * promptLineHeight);
    const prompt2H = Math.max(112, 88 + negativeLines.length * promptLineHeight);
    const cardH = promptY + prompt1H + 18 + prompt2H + 86;
    const outerH = cardH + 80;

    const canvas = document.createElement("canvas");
    canvas.width = outerW * scale;
    canvas.height = outerH * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast("toastError", "shareCard", "Canvas is not available");
      return;
    }
    ctx.scale(scale, scale);

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, outerW, outerH);
    const glow = ctx.createRadialGradient(200, 120, 0, 200, 120, 520);
    glow.addColorStop(0, primary);
    glow.addColorStop(1, bg);
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, outerW, outerH);
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(cardX, cardY);
    ctx.rotate(-0.008);
    ctx.fillStyle = surface;
    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    roundedRectPath(ctx, 0, 0, cardW, cardH, 28);
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 0.65;
    ctx.fillStyle = surface2;
    ctx.fillRect(38, 18, 190, 36);
    ctx.fillRect(cardW - 220, 18, 180, 36);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(46, 98);
    ctx.quadraticCurveTo(80, 60, 122, 96);
    ctx.quadraticCurveTo(150, 124, 178, 96);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cardW - 84, 96, 22, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = primary;
    ctx.font = '900 18px Nunito, sans-serif';
    ctx.fillText(t("shareLabel"), 54, 78);
    ctx.fillStyle = text;
    ctx.font = '900 34px Nunito, sans-serif';
    drawWrappedCanvasText(ctx, summary.fileName.replace(/\.[^.]+$/, ""), 54, 124, cardW - 320, 36, 1);
    ctx.fillStyle = textSoft;
    ctx.font = '700 18px Nunito, sans-serif';
    ctx.fillText(summary.source, 54, 154);

    ctx.save();
    ctx.translate(cardW - 206, 58);
    ctx.rotate(0.03);
    ctx.fillStyle = primary;
    roundedRectPath(ctx, 0, 0, 138, 42, 20);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = '800 16px Nunito, sans-serif';
    ctx.fillText((entry.apiFamily || "SDCPP").toUpperCase(), 69, 27);
    ctx.restore();
    ctx.textAlign = "left";

    ctx.fillStyle = surface2;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.6;
    roundedRectPath(ctx, imgX, imgY, imgBox, imgBox, 24);
    ctx.fill();
    ctx.stroke();

    const preview = await loadCanvasImage(previewSrc);
    if (preview) {
      const iw = preview.naturalWidth || preview.width;
      const ih = preview.naturalHeight || preview.height;
      const fit = Math.min((imgBox - 20) / iw, (imgBox - 20) / ih);
      const dw = iw * fit;
      const dh = ih * fit;
      const dx = imgX + (imgBox - dw) / 2;
      const dy = imgY + (imgBox - dh) / 2;
      ctx.save();
      roundedRectPath(ctx, imgX + 10, imgY + 10, imgBox - 20, imgBox - 20, 18);
      ctx.clip();
      ctx.drawImage(preview, dx, dy, dw, dh);
      ctx.restore();
    }

    const fields = [
      ["Model", summary.model || "—", false],
      ["Version", summary.modelVersion || "—", true],
      ["Resolution", summary.resolution || "—", true],
      ["Steps", summary.steps || "—", true],
      ["Sampler", summary.sampler || "—", false],
      ["CFG", summary.cfg || "—", true],
      ["Seed", summary.seed || "—", true],
      ["Format", summary.format || "—", false]
    ];
    fields.forEach((field, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      drawShareField(ctx, rightX + col * (fieldW + gap), topY + row * (fieldH + gap), fieldW, fieldH, field[0], field[1], border, surface2, text, textSoft, field[2]);
    });

    drawPromptBox(ctx, promptX, promptY, promptW, prompt1H, "Prompt", promptLines, primary, surface2, border, text);
    drawPromptBox(ctx, promptX, promptY + prompt1H + 18, promptW, prompt2H, "Negative", negativeLines, primaryDark, surface2, border, text);

    ctx.fillStyle = textSoft;
    ctx.font = '700 15px "JetBrains Mono", monospace';
    ctx.fillText(`${t("createdLabel")}: ${formatTime(summary.createdAt)}`, 54, cardH - 28);
    drawSdcppCanvasBadge(ctx, cardW - 262, cardH - 64, primary, surface2, textSoft);
    ctx.restore();

    const outName = `${String(summary.fileName || "summary").replace(/\.[^.]+$/, "")}_share_card.png`;
    await saveCanvasToFile(canvas, outName);
    toast("toastSuccess", "shareCard", outName);
  }

  function drawShareField(ctx, x, y, w, h, label, value, border, fill, text, textSoft, mono) {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.6;
    roundedRectPath(ctx, x, y, w, h, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = textSoft;
    ctx.font = '800 15px Nunito, sans-serif';
    ctx.fillText(label, x + 18, y + 28);
    ctx.fillStyle = text;
    ctx.font = mono ? '700 18px "JetBrains Mono", monospace' : '700 19px Nunito, sans-serif';
    drawWrappedCanvasText(ctx, String(value || "—"), x + 18, y + 58, w - 34, 23, 2);
    ctx.restore();
  }

  function drawPromptBox(ctx, x, y, w, h, label, lines, accent, fill, border, text) {
    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.7;
    roundedRectPath(ctx, x, y, w, h, 24);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = '900 17px Nunito, sans-serif';
    ctx.fillText(label, x + 20, y + 30);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 38);
    ctx.quadraticCurveTo(x + 120, y + 44, x + 180, y + 39);
    ctx.stroke();
    ctx.fillStyle = text;
    ctx.font = '600 18px Nunito, sans-serif';
    lines.forEach((line, index) => ctx.fillText(line, x + 20, y + 62 + index * 24));
    ctx.restore();
  }

  function drawSdcppCanvasBadge(ctx, x, y, primary, fill, textSoft) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = fill;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 1.6;
    roundedRectPath(ctx, 0, 0, 214, 48, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = primary;
    ctx.font = '900 18px Nunito, sans-serif';
    ctx.fillText("SDCPP.WEBUI", 14, 21);
    ctx.fillStyle = textSoft;
    ctx.font = '700 11px Nunito, sans-serif';
    ctx.fillText("sd-server image share card", 14, 36);
    ctx.restore();
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawWrappedCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const lines = wrapCanvasLines(text, maxWidth, ctx.font, maxLines);
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
    return lines;
  }

  function wrapCanvasLines(text, maxWidth, font, maxLines) {
    const canvas = document.createElement("canvas");
    const measure = canvas.getContext("2d");
    measure.font = font;
    const source = String(text || "—").trim() || "—";
    const words = /\s/.test(source) ? source.split(/\s+/) : Array.from(source);
    const lines = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current}${/\s/.test(source) ? " " : ""}${word}` : word;
      if (measure.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
        if (lines.length >= maxLines - 1) break;
      }
    }
    if (current && lines.length < maxLines) lines.push(current);
    if (!lines.length) lines.push("—");
    if (words.length && lines.length === maxLines) {
      const last = lines[maxLines - 1];
      lines[maxLines - 1] = last.length > 2 ? `${last.slice(0, Math.max(1, last.length - 1))}…` : last;
    }
    return lines;
  }

  function loadCanvasImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  async function saveCanvasToFile(canvas, filename) {
    if (canvas.toBlob) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas export failed"));
            return;
          }
          downloadBlob(blob, filename);
          resolve();
        }, "image/png");
      });
    }
    triggerDownload(canvas.toDataURL("image/png"), filename);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportGallery() {
    const payload = JSON.stringify(state.gallery, null, 2);
    triggerDownload(`data:application/json;charset=utf-8,${encodeURIComponent(payload)}`, "gallery-history.json");
    toast("toastSuccess", "exportDone");
  }

  function clearGallery() {
    state.gallery = [];
    state.gallerySelectedId = null;
    safeWrite(STORAGE_KEYS.gallery, state.gallery);
    renderGallery();
    renderRecentHistory();
  }

  async function bindImgsDirectory() {
    if (!window.showDirectoryPicker) {
      toast("toastError", "bindImgs", "File System Access API is unavailable here");
      return;
    }
    try {
      const handle = await window.showDirectoryPicker({ id: "sdcpp-imgs", mode: "readwrite" });
      if (!(await ensurePermission(handle, true))) return;
      state.dirHandle = handle;
      await saveDirectoryHandle(handle);
      updateHeroChips();
      toast("toastSuccess", "toastFolderBound", handle.name);
    } catch (error) {
      if (error?.name !== "AbortError") toast("toastError", "bindImgs", error.message || String(error));
    }
  }

  async function forgetImgsDirectory() {
    state.dirHandle = null;
    try {
      const db = await openHandleDb();
      const tx = db.transaction("handles", "readwrite");
      tx.objectStore("handles").delete("imgs");
      await txDone(tx);
    } catch (_error) {
      // ignore
    }
    updateHeroChips();
    toast("toastInfo", "toastFolderForgotten");
  }

  async function loadDirectoryHandle() {
    state.dirHandle = await getSavedDirectoryHandle();
    updateHeroChips();
  }

  async function ensureDirectoryHandle(write = true) {
    if (!state.dirHandle) state.dirHandle = await getSavedDirectoryHandle();
    if (!state.dirHandle) return null;
    return (await ensurePermission(state.dirHandle, write)) ? state.dirHandle : null;
  }

  async function ensurePermission(handle, write) {
    const mode = write ? "readwrite" : "read";
    if ((await handle.queryPermission({ mode })) === "granted") return true;
    return (await handle.requestPermission({ mode })) === "granted";
  }

  async function openHandleDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("sdcpp-webui-fs", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("handles");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveDirectoryHandle(handle) {
    const db = await openHandleDb();
    const tx = db.transaction("handles", "readwrite");
    tx.objectStore("handles").put(handle, "imgs");
    await txDone(tx);
  }

  async function getSavedDirectoryHandle() {
    try {
      const db = await openHandleDb();
      const tx = db.transaction("handles", "readonly");
      const request = tx.objectStore("handles").get("imgs");
      return await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (_error) {
      return null;
    }
  }

  function txDone(tx) {
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  function handleError(label, error) {
    setLatestResponse(label, error.body || { error: error.message || String(error) });
    toast("toastError", label, error.message || String(error));
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback));
    } catch (_error) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (key === STORAGE_KEYS.gallery && Array.isArray(value) && value.length > 12) {
        state.gallery = value.slice(0, Math.max(12, Math.floor(value.length * 0.75)));
        localStorage.setItem(key, JSON.stringify(state.gallery));
      } else {
        throw error;
      }
    }
  }

  async function filesToDataUrls(fileList) {
    return Promise.all([...fileList].map((file) => fileToDataUrl(file)));
  }

  function fileToDataUrl(file) {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  async function dataUrlToBlob(dataUrl) {
    return (await fetch(dataUrl)).blob();
  }

  function toDataUrl(format, base64) {
    return base64.startsWith("data:") ? base64 : `data:image/${format};base64,${base64}`;
  }

  async function createThumbnail(dataUrl) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const size = 280;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);
        const scale = Math.min(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        ctx.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => resolve(dataUrl);
      image.src = dataUrl;
    });
  }

  function formatTime(value) {
    return new Intl.DateTimeFormat(state.activeLanguage, { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value));
  }

  function summary(data) {
    if (!data) return t("noData");
    if (Array.isArray(data)) return `${data.length} item(s)`;
    return `${Object.keys(data).length} key(s)`;
  }

  function short(value) {
    if (value === null || value === undefined) return "-";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  }

  function normalizeBaseUrl(url) {
    return (url || "").trim().replace(/\/+$/, "");
  }

  function tryJson(text) {
    try { return JSON.parse(text); } catch (_error) { return null; }
  }

  function triggerDownload(href, fileName) {
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = fileName;
    anchor.click();
  }

  function randomId() {
    return crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function generateRandomSeed() {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0];
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function escapeHtml(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function toast(titleKey, messageKeyOrText, detail = "") {
    const node = document.createElement("div");
    node.className = "toast";
    const title = t(titleKey);
    const text = detail ? `${t(messageKeyOrText) || messageKeyOrText}: ${detail}` : (t(messageKeyOrText) || messageKeyOrText);
    node.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>`;
    el.toastHost.appendChild(node);
    window.setTimeout(() => node.remove(), 3600);
  }
})();
