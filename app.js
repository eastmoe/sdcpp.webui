(() => {
  const STORAGE_KEYS = {
    settings: "sdcpp.webui.settings.v1",
    gallery: "sdcpp.webui.gallery.v1",
    discoveries: "sdcpp.webui.discoveries.v1",
    formValues: "sdcpp.webui.formValues.v1",
    onboarding: "sdcpp.webui.onboarding.v1"
  };

  const DEFAULT_SETTINGS = {
    apiUrl: "",
    language: "auto",
    palette: "green",
    mode: "auto",
    autoSave: true
  };

  const DEFAULT_ONBOARDING = {
    seen: false,
    completed: false,
    lastStep: 0,
    lastCheckedAt: 0
  };

  const GALLERY_LIMIT = 48;

  const ONBOARDING_STEPS = [
    { key: "welcome", navKey: "wizardStepWelcome", titleKey: "wizardWelcomeTitle", descKey: "wizardWelcomeDesc" },
    { key: "server", navKey: "wizardStepServer", titleKey: "wizardServerTitle", descKey: "wizardServerDesc" },
    { key: "network", navKey: "wizardStepNetwork", titleKey: "wizardNetworkTitle", descKey: "wizardNetworkDesc" },
    { key: "api", navKey: "wizardStepApi", titleKey: "wizardApiTitle", descKey: "wizardApiDesc" },
    { key: "storage", navKey: "wizardStepStorage", titleKey: "wizardStorageTitle", descKey: "wizardStorageDesc" },
    { key: "finish", navKey: "wizardStepFinish", titleKey: "wizardFinishTitle", descKey: "wizardFinishDesc" }
  ];

  const SDCPP_REPO_URL = "https://github.com/leejet/stable-diffusion.cpp/";
  const SDCPP_RELEASES_URL = "https://github.com/leejet/stable-diffusion.cpp/releases";
  const SD_SERVER_START_COMMAND = ".\\bin\\Release\\sd-server.exe --diffusion-model ..\\models\\diffusion_models\\z_image_turbo_bf16.safetensors --vae ..\\models\\vae\\ae.sft --llm ..\\models\\text_encoders\\qwen_3_4b.safetensors --diffusion-fa --offload-to-cpu -v --cfg-scale 1.0";
  const SD_SERVER_LISTEN_COMMAND = "--listen-ip 0.0.0.0 --listen-port 8080";
  const SD_SERVER_EXAMPLES = [
    {
      title: {
        en: "Minimal standalone diffusion example",
        "zh-CN": "基础独立 diffusion 示例",
        "zh-TW": "基礎獨立 diffusion 示例",
        ja: "基本的な standalone diffusion 例",
        ko: "기본 standalone diffusion 예시"
      },
      description: {
        en: "A balanced starter command using a standalone diffusion model, VAE, LLM text encoder, flash attention, and CPU offload.",
        "zh-CN": "适合入门排查的平衡型命令，包含独立 diffusion 模型、VAE、LLM 文本编码器、flash attention 和 CPU offload。",
        "zh-TW": "適合入門排查的平衡型命令，包含獨立 diffusion 模型、VAE、LLM 文字編碼器、flash attention 與 CPU offload。",
        ja: "standalone diffusion model、VAE、LLM テキストエンコーダー、flash attention、CPU offload をまとめた始めやすい例です。",
        ko: "standalone diffusion model, VAE, LLM 텍스트 인코더, flash attention, CPU offload 를 함께 쓰는 시작용 예시입니다."
      },
      command: SD_SERVER_START_COMMAND
    },
    {
      title: {
        en: "Your local Windows example",
        "zh-CN": "你的本地 Windows 示例",
        "zh-TW": "你的本地 Windows 示例",
        ja: "あなたのローカル Windows 例",
        ko: "사용자 Windows 로컬 예시"
      },
      description: {
        en: "This is the exact style of command you shared: local absolute model paths plus --fa for full flash attention.",
        "zh-CN": "这里直接放入了你提供的命令风格：本地绝对模型路径，并使用 `--fa` 启用完整 flash attention。",
        "zh-TW": "這裡直接放入你提供的命令風格：本地絕對模型路徑，並使用 `--fa` 啟用完整 flash attention。",
        ja: "あなたが共有した形そのままの例です。ローカル絶対パスでモデルを指定し、`--fa` で full flash attention を有効にします。",
        ko: "사용자가 준 형태를 그대로 담은 예시입니다. 로컬 절대 경로로 모델을 지정하고 `--fa` 로 전체 flash attention 을 켭니다."
      },
      command: './sd-server --diffusion-model "C:\\Users\\YourUserName\\Downloads\\anima-preview3-base.safetensors" --llm "C:\\Users\\YourUserName\\Downloads\\qwen_3_06b_base.safetensors" --vae "C:\\Users\\YourUserName\\Downloads\\qwen_image_vae.safetensors" --fa'
    },
    {
      title: {
        en: "Expose on another port for a separate frontend",
        "zh-CN": "给独立前端使用的自定义端口示例",
        "zh-TW": "給獨立前端使用的自定義連接埠示例",
        ja: "別ポートで公開する例",
        ko: "별도 프런트엔드용 사용자 포트 예시"
      },
      description: {
        en: "Useful when this standalone WebUI is hosted separately and you want sd-server to listen on every interface at port 8080.",
        "zh-CN": "如果这个独立 WebUI 单独托管，而你希望 sd-server 在所有网卡的 8080 端口监听，可以参考这条命令。",
        "zh-TW": "如果這個獨立 WebUI 是另外託管，而你希望 sd-server 在所有網卡的 8080 連接埠監聽，可以參考這條命令。",
        ja: "この standalone WebUI を別配信し、sd-server を 8080 番ポートで全インターフェース待受けにしたい場合の例です。",
        ko: "이 standalone WebUI 를 별도로 호스팅하고 sd-server 를 모든 인터페이스의 8080 포트에서 열고 싶을 때 참고할 수 있습니다."
      },
      command: '.\\sd-server.exe --diffusion-model ".\\models\\diffusion_models\\model.safetensors" --llm ".\\models\\text_encoders\\text-encoder.safetensors" --vae ".\\models\\vae\\vae.safetensors" --listen-ip 0.0.0.0 --listen-port 8080 --offload-to-cpu -v'
    }
  ];
  const SD_SERVER_PARAM_GROUPS = [
    {
      title: {
        en: "Svr Options",
        "zh-CN": "服务端选项",
        "zh-TW": "服務端選項",
        ja: "サーバーオプション",
        ko: "서버 옵션"
      },
      options: []
    },
    {
      title: {
        en: "Context Options",
        "zh-CN": "上下文与模型选项",
        "zh-TW": "上下文與模型選項",
        ja: "コンテキスト / モデルオプション",
        ko: "컨텍스트 / 모델 옵션"
      },
      options: []
    },
    {
      title: {
        en: "Default Generation Options",
        "zh-CN": "默认生成参数",
        "zh-TW": "預設生成參數",
        ja: "既定の生成オプション",
        ko: "기본 생성 옵션"
      },
      options: []
    }
  ];
  SD_SERVER_PARAM_GROUPS[0].options.push(
    { flag: "-l, --listen-ip <string>", desc: { en: "Server listen IP. Default is 127.0.0.1.", "zh-CN": "服务监听 IP，默认是 127.0.0.1。", "zh-TW": "服務監聽 IP，預設是 127.0.0.1。", ja: "サーバーの listen IP。既定値は 127.0.0.1 です。", ko: "서버 listen IP 입니다. 기본값은 127.0.0.1 입니다." } },
    { flag: "--serve-html-path <string>", desc: { en: "Serve a custom index.html at root instead of the embedded frontend.", "zh-CN": "在根路径提供自定义 `index.html`，而不是使用内嵌前端。", "zh-TW": "在根路徑提供自定義 `index.html`，而不是使用內嵌前端。", ja: "埋め込みフロントエンドの代わりに、任意の `index.html` をルートで配信します。", ko: "내장 프런트엔드 대신 사용자 지정 `index.html` 을 루트에서 제공합니다." } },
    { flag: "--listen-port <int>", desc: { en: "Server listen port. Default is 1234.", "zh-CN": "服务监听端口，默认是 1234。", "zh-TW": "服務監聽連接埠，預設是 1234。", ja: "サーバーの listen ポート。既定値は 1234 です。", ko: "서버 listen 포트입니다. 기본값은 1234 입니다." } },
    { flag: "-v, --verbose", desc: { en: "Print extra runtime information.", "zh-CN": "输出更详细的运行信息。", "zh-TW": "輸出更詳細的執行資訊。", ja: "より詳細な実行情報を表示します。", ko: "더 자세한 실행 정보를 출력합니다." } },
    { flag: "--color", desc: { en: "Use colored log tags by level.", "zh-CN": "按日志级别使用彩色标签。", "zh-TW": "依日誌級別使用彩色標籤。", ja: "ログレベルごとに色付きタグを使います。", ko: "로그 레벨별로 색상이 있는 태그를 사용합니다." } },
    { flag: "-h, --help", desc: { en: "Show help and exit.", "zh-CN": "显示帮助并退出。", "zh-TW": "顯示說明並退出。", ja: "ヘルプを表示して終了します。", ko: "도움말을 표시하고 종료합니다." } }
  );
  SD_SERVER_PARAM_GROUPS[1].options.push(
    { flag: "-m, --model <string>", desc: { en: "Path to a full monolithic model.", "zh-CN": "完整一体化模型文件路径。", "zh-TW": "完整一體化模型檔案路徑。", ja: "フル一体型モデルのパスです。", ko: "전체 일체형 모델 파일 경로입니다." } },
    { flag: "--clip_l <string>", desc: { en: "Path to the CLIP-L text encoder.", "zh-CN": "CLIP-L 文本编码器路径。", "zh-TW": "CLIP-L 文字編碼器路徑。", ja: "CLIP-L テキストエンコーダーのパスです。", ko: "CLIP-L 텍스트 인코더 경로입니다." } },
    { flag: "--clip_g <string>", desc: { en: "Path to the CLIP-G text encoder.", "zh-CN": "CLIP-G 文本编码器路径。", "zh-TW": "CLIP-G 文字編碼器路徑。", ja: "CLIP-G テキストエンコーダーのパスです。", ko: "CLIP-G 텍스트 인코더 경로입니다." } },
    { flag: "--clip_vision <string>", desc: { en: "Path to the CLIP vision encoder.", "zh-CN": "CLIP 视觉编码器路径。", "zh-TW": "CLIP 視覺編碼器路徑。", ja: "CLIP vision エンコーダーのパスです。", ko: "CLIP 비전 인코더 경로입니다." } },
    { flag: "--t5xxl <string>", desc: { en: "Path to the T5XXL text encoder.", "zh-CN": "T5XXL 文本编码器路径。", "zh-TW": "T5XXL 文字編碼器路徑。", ja: "T5XXL テキストエンコーダーのパスです。", ko: "T5XXL 텍스트 인코더 경로입니다." } },
    { flag: "--llm <string>", desc: { en: "Path to the LLM text encoder used by pipelines such as Qwen-Image or Flux2.", "zh-CN": "LLM 文本编码器路径，例如 Qwen-Image 或 Flux2 这类流程会用到。", "zh-TW": "LLM 文字編碼器路徑，例如 Qwen-Image 或 Flux2 這類流程會用到。", ja: "Qwen-Image や Flux2 などで使う LLM テキストエンコーダーのパスです。", ko: "Qwen-Image 나 Flux2 같은 파이프라인에서 쓰는 LLM 텍스트 인코더 경로입니다." } },
    { flag: "--llm_vision <string>", desc: { en: "Path to the LLM vision transformer / visual encoder.", "zh-CN": "LLM 视觉编码器或视觉 Transformer 路径。", "zh-TW": "LLM 視覺編碼器或視覺 Transformer 路徑。", ja: "LLM の vision transformer / visual encoder のパスです。", ko: "LLM 비전 인코더 또는 비전 transformer 경로입니다." } },
    { flag: "--qwen2vl <string>", desc: { en: "Deprecated alias of --llm.", "zh-CN": "`--llm` 的已废弃别名。", "zh-TW": "`--llm` 的已廢棄別名。", ja: "`--llm` の非推奨エイリアスです。", ko: "`--llm` 의 더 이상 권장되지 않는 별칭입니다." } },
    { flag: "--qwen2vl_vision <string>", desc: { en: "Deprecated alias of --llm_vision.", "zh-CN": "`--llm_vision` 的已废弃别名。", "zh-TW": "`--llm_vision` 的已廢棄別名。", ja: "`--llm_vision` の非推奨エイリアスです。", ko: "`--llm_vision` 의 더 이상 권장되지 않는 별칭입니다." } },
    { flag: "--diffusion-model <string>", desc: { en: "Path to the standalone diffusion model.", "zh-CN": "独立 diffusion 模型路径。", "zh-TW": "獨立 diffusion 模型路徑。", ja: "standalone diffusion model のパスです。", ko: "standalone diffusion model 경로입니다." } },
    { flag: "--high-noise-diffusion-model <string>", desc: { en: "Path to the standalone high-noise diffusion model.", "zh-CN": "高噪声阶段 standalone diffusion 模型路径。", "zh-TW": "高噪聲階段 standalone diffusion 模型路徑。", ja: "high-noise 用 standalone diffusion model のパスです。", ko: "high-noise 단계용 standalone diffusion model 경로입니다." } },
    { flag: "--vae <string>", desc: { en: "Path to a standalone VAE model.", "zh-CN": "独立 VAE 模型路径。", "zh-TW": "獨立 VAE 模型路徑。", ja: "standalone VAE モデルのパスです。", ko: "standalone VAE 모델 경로입니다." } },
    { flag: "--taesd <string>", desc: { en: "Path to Tiny AutoEncoder for faster but lower-quality decoding.", "zh-CN": "Tiny AutoEncoder 路径，用于更快但质量较低的解码。", "zh-TW": "Tiny AutoEncoder 路徑，用於更快但品質較低的解碼。", ja: "高速だが低品質寄りのデコード用 Tiny AutoEncoder のパスです。", ko: "더 빠르지만 품질은 낮을 수 있는 Tiny AutoEncoder 경로입니다." } },
    { flag: "--tae <string>", desc: { en: "Alias of --taesd.", "zh-CN": "`--taesd` 的别名。", "zh-TW": "`--taesd` 的別名。", ja: "`--taesd` のエイリアスです。", ko: "`--taesd` 의 별칭입니다." } },
    { flag: "--control-net <string>", desc: { en: "Path to a ControlNet model.", "zh-CN": "ControlNet 模型路径。", "zh-TW": "ControlNet 模型路徑。", ja: "ControlNet モデルのパスです。", ko: "ControlNet 모델 경로입니다." } },
    { flag: "--embd-dir <string>", desc: { en: "Embeddings directory path.", "zh-CN": "embeddings 目录路径。", "zh-TW": "embeddings 目錄路徑。", ja: "embeddings ディレクトリのパスです。", ko: "embeddings 디렉터리 경로입니다." } },
    { flag: "--lora-model-dir <string>", desc: { en: "LoRA model directory path.", "zh-CN": "LoRA 模型目录路径。", "zh-TW": "LoRA 模型目錄路徑。", ja: "LoRA モデルディレクトリのパスです。", ko: "LoRA 모델 디렉터리 경로입니다." } },
    { flag: "--tensor-type-rules <string>", desc: { en: "Per-tensor weight type rules, for example '^vae.=f16,model.=q8_0'.", "zh-CN": "按张量模式指定权重类型，例如 `^vae.=f16,model.=q8_0`。", "zh-TW": "依張量模式指定權重型別，例如 `^vae.=f16,model.=q8_0`。", ja: "テンソルごとの重み型ルールです。例: `^vae.=f16,model.=q8_0`。", ko: "텐서 패턴별 가중치 타입 규칙입니다. 예: `^vae.=f16,model.=q8_0`." } },
    { flag: "--photo-maker <string>", desc: { en: "Path to a PHOTOMAKER model.", "zh-CN": "PHOTOMAKER 模型路径。", "zh-TW": "PHOTOMAKER 模型路徑。", ja: "PHOTOMAKER モデルのパスです。", ko: "PHOTOMAKER 모델 경로입니다." } },
    { flag: "--upscale-model <string>", desc: { en: "Path to an ESRGAN upscaler model.", "zh-CN": "ESRGAN 放大模型路径。", "zh-TW": "ESRGAN 放大模型路徑。", ja: "ESRGAN アップスケーラーモデルのパスです。", ko: "ESRGAN 업스케일 모델 경로입니다." } },
    { flag: "-t, --threads <int>", desc: { en: "Number of compute threads. <= 0 means using CPU physical core count.", "zh-CN": "计算线程数。<= 0 时会使用 CPU 物理核心数。", "zh-TW": "計算執行緒數。<= 0 時會使用 CPU 實體核心數。", ja: "計算スレッド数です。<= 0 の場合は CPU 物理コア数が使われます。", ko: "연산 스레드 수입니다. <= 0 이면 CPU 물리 코어 수를 사용합니다." } },
    { flag: "--chroma-t5-mask-pad <int>", desc: { en: "T5 mask padding size for Chroma pipelines.", "zh-CN": "Chroma 流程的 T5 mask padding 大小。", "zh-TW": "Chroma 流程的 T5 mask padding 大小。", ja: "Chroma 系パイプライン向け T5 mask padding サイズです。", ko: "Chroma 파이프라인용 T5 mask padding 크기입니다." } },
    { flag: "--vae-tile-overlap <float>", desc: { en: "VAE tiling overlap ratio. Default is 0.5.", "zh-CN": "VAE 切片重叠比例，默认 0.5。", "zh-TW": "VAE 切片重疊比例，預設 0.5。", ja: "VAE タイル処理の重なり率です。既定値は 0.5。", ko: "VAE 타일 처리 겹침 비율입니다. 기본값은 0.5 입니다." } },
    { flag: "--vae-tiling", desc: { en: "Process the VAE in tiles to reduce memory usage.", "zh-CN": "以切片方式处理 VAE 以降低内存占用。", "zh-TW": "以切片方式處理 VAE 以降低記憶體占用。", ja: "VAE をタイル処理してメモリ使用量を下げます。", ko: "VAE 를 타일 방식으로 처리해 메모리 사용량을 줄입니다." } },
    { flag: "--force-sdxl-vae-conv-scale", desc: { en: "Force conv scale usage on SDXL VAE.", "zh-CN": "强制在 SDXL VAE 上使用 conv scale。", "zh-TW": "強制在 SDXL VAE 上使用 conv scale。", ja: "SDXL VAE で conv scale を強制使用します。", ko: "SDXL VAE 에서 conv scale 사용을 강제합니다." } }
  );
  SD_SERVER_PARAM_GROUPS[1].options.push(
    { flag: "--offload-to-cpu", desc: { en: "Keep more weights in RAM to reduce VRAM pressure.", "zh-CN": "把更多权重放在内存中，以减轻显存压力。", "zh-TW": "把更多權重放在記憶體中，以減輕顯存壓力。", ja: "より多くの重みを RAM 側に置き、VRAM 圧迫を減らします。", ko: "더 많은 가중치를 RAM 에 두어 VRAM 부담을 줄입니다." } },
    { flag: "--mmap", desc: { en: "Use memory-mapped model loading when available.", "zh-CN": "可用时使用内存映射方式加载模型。", "zh-TW": "可用時使用記憶體映射方式載入模型。", ja: "利用可能ならメモリマップでモデルを読み込みます。", ko: "가능하면 메모리 매핑 방식으로 모델을 로드합니다." } },
    { flag: "--control-net-cpu", desc: { en: "Keep ControlNet on CPU for low-VRAM setups.", "zh-CN": "在低显存场景下把 ControlNet 放在 CPU。", "zh-TW": "在低顯存場景下把 ControlNet 放在 CPU。", ja: "低 VRAM 環境向けに ControlNet を CPU 側へ置きます。", ko: "저 VRAM 환경에서 ControlNet 을 CPU 에 둡니다." } },
    { flag: "--clip-on-cpu", desc: { en: "Keep CLIP on CPU for low-VRAM setups.", "zh-CN": "在低显存场景下把 CLIP 放在 CPU。", "zh-TW": "在低顯存場景下把 CLIP 放在 CPU。", ja: "低 VRAM 環境向けに CLIP を CPU 側へ置きます。", ko: "저 VRAM 환경에서 CLIP 을 CPU 에 둡니다." } },
    { flag: "--vae-on-cpu", desc: { en: "Keep VAE on CPU for low-VRAM setups.", "zh-CN": "在低显存场景下把 VAE 放在 CPU。", "zh-TW": "在低顯存場景下把 VAE 放在 CPU。", ja: "低 VRAM 環境向けに VAE を CPU 側へ置きます。", ko: "저 VRAM 환경에서 VAE 를 CPU 에 둡니다." } },
    { flag: "--fa", desc: { en: "Enable full flash attention.", "zh-CN": "启用完整的 flash attention。", "zh-TW": "啟用完整的 flash attention。", ja: "full flash attention を有効にします。", ko: "전체 flash attention 을 켭니다." } },
    { flag: "--diffusion-fa", desc: { en: "Enable flash attention only for the diffusion model.", "zh-CN": "只为 diffusion 模型启用 flash attention。", "zh-TW": "只為 diffusion 模型啟用 flash attention。", ja: "diffusion model 側だけ flash attention を有効にします。", ko: "diffusion model 쪽에만 flash attention 을 켭니다." } },
    { flag: "--diffusion-conv-direct", desc: { en: "Use ggml_conv2d_direct in the diffusion model.", "zh-CN": "在 diffusion 模型中使用 `ggml_conv2d_direct`。", "zh-TW": "在 diffusion 模型中使用 `ggml_conv2d_direct`。", ja: "diffusion model で `ggml_conv2d_direct` を使います。", ko: "diffusion model 에서 `ggml_conv2d_direct` 를 사용합니다." } },
    { flag: "--vae-conv-direct", desc: { en: "Use ggml_conv2d_direct in the VAE model.", "zh-CN": "在 VAE 模型中使用 `ggml_conv2d_direct`。", "zh-TW": "在 VAE 模型中使用 `ggml_conv2d_direct`。", ja: "VAE model で `ggml_conv2d_direct` を使います。", ko: "VAE model 에서 `ggml_conv2d_direct` 를 사용합니다." } },
    { flag: "--circular", desc: { en: "Enable circular padding for convolutions.", "zh-CN": "为卷积启用 circular padding。", "zh-TW": "為卷積啟用 circular padding。", ja: "畳み込みで circular padding を有効にします。", ko: "컨볼루션에 circular padding 을 켭니다." } },
    { flag: "--circularx", desc: { en: "Enable circular RoPE wrapping only on the X axis.", "zh-CN": "只在 X 轴启用 circular RoPE wrapping。", "zh-TW": "只在 X 軸啟用 circular RoPE wrapping。", ja: "X 軸方向だけ circular RoPE wrapping を有効にします。", ko: "X 축에만 circular RoPE wrapping 을 켭니다." } },
    { flag: "--circulary", desc: { en: "Enable circular RoPE wrapping only on the Y axis.", "zh-CN": "只在 Y 轴启用 circular RoPE wrapping。", "zh-TW": "只在 Y 軸啟用 circular RoPE wrapping。", ja: "Y 軸方向だけ circular RoPE wrapping を有効にします。", ko: "Y 축에만 circular RoPE wrapping 을 켭니다." } },
    { flag: "--chroma-disable-dit-mask", desc: { en: "Disable the DiT mask in Chroma.", "zh-CN": "在 Chroma 中禁用 DiT mask。", "zh-TW": "在 Chroma 中禁用 DiT mask。", ja: "Chroma で DiT mask を無効にします。", ko: "Chroma 에서 DiT mask 를 끕니다." } },
    { flag: "--qwen-image-zero-cond-t", desc: { en: "Enable zero_cond_t for Qwen Image pipelines.", "zh-CN": "为 Qwen Image 流程启用 `zero_cond_t`。", "zh-TW": "為 Qwen Image 流程啟用 `zero_cond_t`。", ja: "Qwen Image 系パイプラインで `zero_cond_t` を有効にします。", ko: "Qwen Image 파이프라인에서 `zero_cond_t` 를 켭니다." } },
    { flag: "--chroma-enable-t5-mask", desc: { en: "Enable the T5 mask in Chroma.", "zh-CN": "在 Chroma 中启用 T5 mask。", "zh-TW": "在 Chroma 中啟用 T5 mask。", ja: "Chroma で T5 mask を有効にします。", ko: "Chroma 에서 T5 mask 를 켭니다." } },
    { flag: "--type <string>", desc: { en: "Override weight type such as f16, q8_0, q4_K, and so on.", "zh-CN": "覆盖权重类型，例如 f16、q8_0、q4_K 等。", "zh-TW": "覆蓋權重型別，例如 f16、q8_0、q4_K 等。", ja: "f16、q8_0、q4_K などの重み型を上書き指定します。", ko: "f16, q8_0, q4_K 같은 가중치 타입을 덮어씁니다." } },
    { flag: "--rng <string>", desc: { en: "Choose RNG backend: std_default, cuda, or cpu.", "zh-CN": "选择 RNG 后端：`std_default`、`cuda` 或 `cpu`。", "zh-TW": "選擇 RNG 後端：`std_default`、`cuda` 或 `cpu`。", ja: "RNG backend を `std_default`、`cuda`、`cpu` から選びます。", ko: "RNG 백엔드를 `std_default`, `cuda`, `cpu` 중에서 고릅니다." } },
    { flag: "--sampler-rng <string>", desc: { en: "Sampler RNG backend. If omitted, uses --rng.", "zh-CN": "采样器的 RNG 后端；省略时跟随 `--rng`。", "zh-TW": "採樣器的 RNG 後端；省略時跟隨 `--rng`。", ja: "sampler 用 RNG backend です。省略時は `--rng` を使います。", ko: "샘플러용 RNG 백엔드입니다. 생략하면 `--rng` 를 사용합니다." } },
    { flag: "--prediction <string>", desc: { en: "Prediction type override such as eps, v, edm_v, sd3_flow, flux_flow, or flux2_flow.", "zh-CN": "覆盖 prediction 类型，例如 eps、v、edm_v、sd3_flow、flux_flow、flux2_flow。", "zh-TW": "覆蓋 prediction 型別，例如 eps、v、edm_v、sd3_flow、flux_flow、flux2_flow。", ja: "eps、v、edm_v、sd3_flow、flux_flow、flux2_flow などの prediction type を上書きします。", ko: "eps, v, edm_v, sd3_flow, flux_flow, flux2_flow 같은 prediction type 을 덮어씁니다." } },
    { flag: "--lora-apply-mode <string>", desc: { en: "LoRA apply mode: auto, immediately, or at_runtime. Auto picks at_runtime for quantized weights.", "zh-CN": "LoRA 应用方式：`auto`、`immediately`、`at_runtime`；量化权重时 `auto` 会倾向 `at_runtime`。", "zh-TW": "LoRA 套用方式：`auto`、`immediately`、`at_runtime`；量化權重時 `auto` 會傾向 `at_runtime`。", ja: "LoRA の適用モードです。`auto`、`immediately`、`at_runtime` から選び、量子化重みでは `auto` が `at_runtime` を選びやすくなります。", ko: "LoRA 적용 모드입니다. `auto`, `immediately`, `at_runtime` 중에서 고르며, 양자화 가중치에서는 `auto` 가 `at_runtime` 을 선택하기 쉽습니다." } },
    { flag: "--vae-tile-size <string>", desc: { en: "VAE tile size in [X]x[Y] format. Default is 32x32.", "zh-CN": "VAE 切片大小，格式为 `[X]x[Y]`，默认 32x32。", "zh-TW": "VAE 切片大小，格式為 `[X]x[Y]`，預設 32x32。", ja: "VAE タイルサイズです。形式は `[X]x[Y]`、既定値は 32x32。", ko: "VAE 타일 크기입니다. 형식은 `[X]x[Y]`, 기본값은 32x32 입니다." } },
    { flag: "--vae-relative-tile-size <string>", desc: { en: "Relative VAE tile size. Values < 1 are fractions of image size; values >= 1 mean tiles per dimension.", "zh-CN": "相对 VAE 切片大小；< 1 表示图像尺寸比例，>= 1 表示每个维度的切片数。", "zh-TW": "相對 VAE 切片大小；< 1 表示圖像尺寸比例，>= 1 表示每個維度的切片數。", ja: "相対 VAE タイルサイズです。< 1 は画像サイズ比、>= 1 は各次元のタイル数を意味します。", ko: "상대 VAE 타일 크기입니다. < 1 은 이미지 크기 비율, >= 1 은 각 차원의 타일 개수를 의미합니다." } }
  );
  SD_SERVER_PARAM_GROUPS[2].options.push(
    { flag: "-p, --prompt <string>", desc: { en: "Prompt text to render.", "zh-CN": "要生成的 prompt 文本。", "zh-TW": "要生成的 prompt 文字。", ja: "生成に使う prompt テキストです。", ko: "생성에 사용할 prompt 텍스트입니다." } },
    { flag: "-n, --negative-prompt <string>", desc: { en: "Negative prompt text.", "zh-CN": "negative prompt 文本。", "zh-TW": "negative prompt 文字。", ja: "negative prompt テキストです。", ko: "negative prompt 텍스트입니다." } },
    { flag: "-i, --init-img <string>", desc: { en: "Path to the init image.", "zh-CN": "初始图像路径。", "zh-TW": "初始圖像路徑。", ja: "初期画像のパスです。", ko: "초기 이미지 경로입니다." } },
    { flag: "--end-img <string>", desc: { en: "Path to the end image, required by flf2v workflows.", "zh-CN": "结束图像路径，`flf2v` 流程需要。", "zh-TW": "結束圖像路徑，`flf2v` 流程需要。", ja: "end image のパスで、flf2v ワークフローで必要です。", ko: "종료 이미지 경로이며 flf2v 워크플로에서 필요합니다." } },
    { flag: "--mask <string>", desc: { en: "Path to the mask image.", "zh-CN": "mask 图像路径。", "zh-TW": "mask 圖像路徑。", ja: "mask 画像のパスです。", ko: "mask 이미지 경로입니다." } },
    { flag: "--control-image <string>", desc: { en: "Path to a ControlNet control image.", "zh-CN": "ControlNet 控制图路径。", "zh-TW": "ControlNet 控制圖路徑。", ja: "ControlNet 用 control image のパスです。", ko: "ControlNet 제어 이미지 경로입니다." } },
    { flag: "--control-video <string>", desc: { en: "Directory of control video frames stored in lexicographic order, such as 00.png, 01.png, etc.", "zh-CN": "控制视频帧目录，内部图片需按字典序排列，例如 00.png、01.png。", "zh-TW": "控制影片影格目錄，內部圖片需按字典序排列，例如 00.png、01.png。", ja: "control video フレームのディレクトリです。00.png、01.png のように辞書順で並ぶ必要があります。", ko: "제어 비디오 프레임 디렉터리입니다. 00.png, 01.png 처럼 사전식 순서로 정렬되어 있어야 합니다." } },
    { flag: "--pm-id-images-dir <string>", desc: { en: "Directory of PHOTOMAKER input identity images.", "zh-CN": "PHOTOMAKER 输入身份图目录。", "zh-TW": "PHOTOMAKER 輸入身份圖目錄。", ja: "PHOTOMAKER 用 ID 画像ディレクトリです。", ko: "PHOTOMAKER 입력 ID 이미지 디렉터리입니다." } },
    { flag: "--pm-id-embed-path <string>", desc: { en: "Path to PHOTOMAKER v2 identity embedding.", "zh-CN": "PHOTOMAKER v2 身份 embedding 路径。", "zh-TW": "PHOTOMAKER v2 身份 embedding 路徑。", ja: "PHOTOMAKER v2 の ID embedding パスです。", ko: "PHOTOMAKER v2 ID embedding 경로입니다." } },
    { flag: "-H, --height <int>", desc: { en: "Image height in pixels. Default is 512.", "zh-CN": "图像高度，单位像素，默认 512。", "zh-TW": "圖像高度，單位像素，預設 512。", ja: "画像高さ（ピクセル）です。既定値は 512。", ko: "이미지 높이(픽셀)입니다. 기본값은 512 입니다." } },
    { flag: "-W, --width <int>", desc: { en: "Image width in pixels. Default is 512.", "zh-CN": "图像宽度，单位像素，默认 512。", "zh-TW": "圖像寬度，單位像素，預設 512。", ja: "画像幅（ピクセル）です。既定値は 512。", ko: "이미지 너비(픽셀)입니다. 기본값은 512 입니다." } },
    { flag: "--steps <int>", desc: { en: "Sample step count. Default is 20.", "zh-CN": "采样步数，默认 20。", "zh-TW": "採樣步數，預設 20。", ja: "サンプルステップ数です。既定値は 20。", ko: "샘플링 스텝 수입니다. 기본값은 20 입니다." } },
    { flag: "--high-noise-steps <int>", desc: { en: "High-noise sample steps. -1 means auto.", "zh-CN": "高噪声阶段步数，`-1` 表示自动。", "zh-TW": "高噪聲階段步數，`-1` 表示自動。", ja: "high-noise 側のステップ数です。`-1` は自動。", ko: "high-noise 단계 스텝 수입니다. `-1` 은 자동입니다." } },
    { flag: "--clip-skip <int>", desc: { en: "Skip the last CLIP layers. 1 means none, 2 skips one layer.", "zh-CN": "跳过最后几层 CLIP；1 表示不跳，2 表示跳过一层。", "zh-TW": "跳過最後幾層 CLIP；1 表示不跳，2 表示跳過一層。", ja: "最後の CLIP 層をスキップします。1 は未スキップ、2 は 1 層スキップです。", ko: "마지막 CLIP 레이어를 건너뜁니다. 1 은 건너뛰지 않음, 2 는 한 레이어를 건너뜁니다." } },
    { flag: "-b, --batch-count <int>", desc: { en: "Batch count.", "zh-CN": "batch 数量。", "zh-TW": "batch 數量。", ja: "batch 数です。", ko: "batch 수입니다." } },
    { flag: "--video-frames <int>", desc: { en: "Video frame count. Default is 1.", "zh-CN": "视频帧数，默认 1。", "zh-TW": "影片影格數，預設 1。", ja: "動画フレーム数です。既定値は 1。", ko: "비디오 프레임 수입니다. 기본값은 1 입니다." } },
    { flag: "--fps <int>", desc: { en: "Frames per second. Default is 24.", "zh-CN": "帧率，默认 24。", "zh-TW": "幀率，預設 24。", ja: "fps です。既定値は 24。", ko: "fps 입니다. 기본값은 24 입니다." } },
    { flag: "--timestep-shift <int>", desc: { en: "Shift timestep for NitroFusion models.", "zh-CN": "NitroFusion 模型的 timestep shift。", "zh-TW": "NitroFusion 模型的 timestep shift。", ja: "NitroFusion モデル向け timestep shift です。", ko: "NitroFusion 모델용 timestep shift 입니다." } },
    { flag: "--upscale-repeats <int>", desc: { en: "How many times to run ESRGAN upscaling. Default is 1.", "zh-CN": "ESRGAN 放大的重复次数，默认 1。", "zh-TW": "ESRGAN 放大的重複次數，預設 1。", ja: "ESRGAN アップスケーリングを何回実行するか。既定値は 1。", ko: "ESRGAN 업스케일을 몇 번 실행할지 설정합니다. 기본값은 1 입니다." } },
    { flag: "--upscale-tile-size <int>", desc: { en: "Tile size for ESRGAN upscaling. Default is 128.", "zh-CN": "ESRGAN 放大的 tile 大小，默认 128。", "zh-TW": "ESRGAN 放大的 tile 大小，預設 128。", ja: "ESRGAN アップスケールの tile サイズです。既定値は 128。", ko: "ESRGAN 업스케일 tile 크기입니다. 기본값은 128 입니다." } }
  );
  SD_SERVER_PARAM_GROUPS[2].options.push(
    { flag: "--cfg-scale <float>", desc: { en: "Unconditional guidance scale. Default is 7.0.", "zh-CN": "无条件引导强度，默认 7.0。", "zh-TW": "無條件引導強度，預設 7.0。", ja: "unconditional guidance scale です。既定値は 7.0。", ko: "unconditional guidance scale 입니다. 기본값은 7.0 입니다." } },
    { flag: "--img-cfg-scale <float>", desc: { en: "Image guidance scale for inpaint or instruct-pix2pix. Defaults to --cfg-scale.", "zh-CN": "inpaint 或 instruct-pix2pix 的图像引导强度；默认跟随 `--cfg-scale`。", "zh-TW": "inpaint 或 instruct-pix2pix 的圖像引導強度；預設跟隨 `--cfg-scale`。", ja: "inpaint や instruct-pix2pix 用 image guidance scale です。既定では `--cfg-scale` を使います。", ko: "inpaint 또는 instruct-pix2pix 용 image guidance scale 입니다. 기본적으로 `--cfg-scale` 을 따릅니다." } },
    { flag: "--guidance <float>", desc: { en: "Distilled guidance scale. Default is 3.5.", "zh-CN": "蒸馏 guidance 强度，默认 3.5。", "zh-TW": "蒸餾 guidance 強度，預設 3.5。", ja: "distilled guidance scale です。既定値は 3.5。", ko: "distilled guidance scale 입니다. 기본값은 3.5 입니다." } },
    { flag: "--slg-scale <float>", desc: { en: "Skip Layer Guidance scale for DiT models.", "zh-CN": "DiT 模型的 Skip Layer Guidance 强度。", "zh-TW": "DiT 模型的 Skip Layer Guidance 強度。", ja: "DiT モデル向け Skip Layer Guidance scale です。", ko: "DiT 모델용 Skip Layer Guidance scale 입니다." } },
    { flag: "--skip-layer-start <float>", desc: { en: "SLG start point. Default is 0.01.", "zh-CN": "SLG 起始点，默认 0.01。", "zh-TW": "SLG 起始點，預設 0.01。", ja: "SLG 開始位置です。既定値は 0.01。", ko: "SLG 시작 지점입니다. 기본값은 0.01 입니다." } },
    { flag: "--skip-layer-end <float>", desc: { en: "SLG end point. Default is 0.2.", "zh-CN": "SLG 结束点，默认 0.2。", "zh-TW": "SLG 結束點，預設 0.2。", ja: "SLG 終了位置です。既定値は 0.2。", ko: "SLG 종료 지점입니다. 기본값은 0.2 입니다." } },
    { flag: "--eta <float>", desc: { en: "Noise multiplier used by certain samplers.", "zh-CN": "部分采样器使用的噪声乘数。", "zh-TW": "部分採樣器使用的噪聲乘數。", ja: "一部 sampler で使う noise multiplier です。", ko: "일부 샘플러가 사용하는 noise multiplier 입니다." } },
    { flag: "--flow-shift <float>", desc: { en: "Flow-model shift value such as for SD3.x or WAN.", "zh-CN": "Flow 模型位移值，例如 SD3.x 或 WAN。", "zh-TW": "Flow 模型位移值，例如 SD3.x 或 WAN。", ja: "SD3.x や WAN などの Flow model 用 shift 値です。", ko: "SD3.x 또는 WAN 같은 Flow 모델용 shift 값입니다." } },
    { flag: "--high-noise-cfg-scale <float>", desc: { en: "High-noise unconditional guidance scale.", "zh-CN": "高噪声阶段的无条件引导强度。", "zh-TW": "高噪聲階段的無條件引導強度。", ja: "high-noise 側の unconditional guidance scale です。", ko: "high-noise 단계의 unconditional guidance scale 입니다." } },
    { flag: "--high-noise-img-cfg-scale <float>", desc: { en: "High-noise image guidance scale.", "zh-CN": "高噪声阶段的图像引导强度。", "zh-TW": "高噪聲階段的圖像引導強度。", ja: "high-noise 側の image guidance scale です。", ko: "high-noise 단계의 image guidance scale 입니다." } },
    { flag: "--high-noise-guidance <float>", desc: { en: "High-noise distilled guidance scale.", "zh-CN": "高噪声阶段的蒸馏 guidance 强度。", "zh-TW": "高噪聲階段的蒸餾 guidance 強度。", ja: "high-noise 側の distilled guidance scale です。", ko: "high-noise 단계의 distilled guidance scale 입니다." } },
    { flag: "--high-noise-slg-scale <float>", desc: { en: "High-noise SLG scale.", "zh-CN": "高噪声阶段的 SLG 强度。", "zh-TW": "高噪聲階段的 SLG 強度。", ja: "high-noise 側の SLG scale です。", ko: "high-noise 단계의 SLG scale 입니다." } },
    { flag: "--high-noise-skip-layer-start <float>", desc: { en: "High-noise SLG start point.", "zh-CN": "高噪声阶段的 SLG 起始点。", "zh-TW": "高噪聲階段的 SLG 起始點。", ja: "high-noise 側の SLG 開始位置です。", ko: "high-noise 단계의 SLG 시작 지점입니다." } },
    { flag: "--high-noise-skip-layer-end <float>", desc: { en: "High-noise SLG end point.", "zh-CN": "高噪声阶段的 SLG 结束点。", "zh-TW": "高噪聲階段的 SLG 結束點。", ja: "high-noise 側の SLG 終了位置です。", ko: "high-noise 단계의 SLG 종료 지점입니다." } },
    { flag: "--high-noise-eta <float>", desc: { en: "High-noise noise multiplier.", "zh-CN": "高噪声阶段的噪声乘数。", "zh-TW": "高噪聲階段的噪聲乘數。", ja: "high-noise 側の noise multiplier です。", ko: "high-noise 단계의 noise multiplier 입니다." } },
    { flag: "--strength <float>", desc: { en: "Noising / denoising strength. Default is 0.75.", "zh-CN": "加噪 / 去噪强度，默认 0.75。", "zh-TW": "加噪 / 去噪強度，預設 0.75。", ja: "noising / denoising 強度です。既定値は 0.75。", ko: "노이즈 / 디노이즈 강도입니다. 기본값은 0.75 입니다." } },
    { flag: "--pm-style-strength <float>", desc: { en: "PHOTOMAKER style strength.", "zh-CN": "PHOTOMAKER 风格强度。", "zh-TW": "PHOTOMAKER 風格強度。", ja: "PHOTOMAKER の style strength です。", ko: "PHOTOMAKER 스타일 강도입니다." } },
    { flag: "--control-strength <float>", desc: { en: "ControlNet strength. 1.0 means full destruction of init-image information.", "zh-CN": "ControlNet 强度；1.0 表示对初始图信息的完全破坏。", "zh-TW": "ControlNet 強度；1.0 表示對初始圖資訊的完全破壞。", ja: "ControlNet 強度です。1.0 は初期画像情報を完全に壊すレベルです。", ko: "ControlNet 강도입니다. 1.0 은 초기 이미지 정보를 완전히 파괴하는 수준입니다." } },
    { flag: "--moe-boundary <float>", desc: { en: "Timestep boundary for Wan2.2 MoE models.", "zh-CN": "Wan2.2 MoE 模型的 timestep 边界。", "zh-TW": "Wan2.2 MoE 模型的 timestep 邊界。", ja: "Wan2.2 MoE モデル向け timestep boundary です。", ko: "Wan2.2 MoE 모델용 timestep boundary 입니다." } },
    { flag: "--vace-strength <float>", desc: { en: "Wan VACE strength.", "zh-CN": "Wan VACE 强度。", "zh-TW": "Wan VACE 強度。", ja: "Wan VACE strength です。", ko: "Wan VACE 강도입니다." } }
  );
  SD_SERVER_PARAM_GROUPS[2].options.push(
    { flag: "--increase-ref-index", desc: { en: "Automatically increment reference-image indices in listed order.", "zh-CN": "按列出顺序自动递增参考图索引。", "zh-TW": "按列出順序自動遞增參考圖索引。", ja: "列挙順に reference image の index を自動増加させます。", ko: "나열된 순서대로 reference image 인덱스를 자동 증가시킵니다." } },
    { flag: "--disable-auto-resize-ref-image", desc: { en: "Disable automatic resize for reference images.", "zh-CN": "禁用参考图自动缩放。", "zh-TW": "禁用參考圖自動縮放。", ja: "reference image の自動リサイズを無効にします。", ko: "reference image 자동 리사이즈를 끕니다." } },
    { flag: "--disable-image-metadata", desc: { en: "Do not embed generation metadata into output image files.", "zh-CN": "不要把生成元数据写入输出图像文件。", "zh-TW": "不要把生成中繼資料寫入輸出圖像檔案。", ja: "生成メタデータを出力画像へ埋め込まないようにします。", ko: "생성 메타데이터를 출력 이미지 파일에 넣지 않습니다." } },
    { flag: "-s, --seed <int>", desc: { en: "RNG seed. Negative values mean random seed.", "zh-CN": "随机种子；负值表示随机种子。", "zh-TW": "隨機種子；負值表示隨機種子。", ja: "乱数シードです。負の値はランダムシードを意味します。", ko: "랜덤 시드입니다. 음수는 랜덤 시드를 의미합니다." } },
    { flag: "--sampling-method <string>", desc: { en: "Primary sampler method such as euler, dpm++2m, lcm, tcd, and others.", "zh-CN": "主采样方法，例如 euler、dpm++2m、lcm、tcd 等。", "zh-TW": "主採樣方法，例如 euler、dpm++2m、lcm、tcd 等。", ja: "主 sampler 方法です。euler、dpm++2m、lcm、tcd などが使えます。", ko: "기본 샘플러 방식입니다. euler, dpm++2m, lcm, tcd 등을 사용할 수 있습니다." } },
    { flag: "--high-noise-sampling-method <string>", desc: { en: "Sampler method for the high-noise stage.", "zh-CN": "高噪声阶段使用的采样方法。", "zh-TW": "高噪聲階段使用的採樣方法。", ja: "high-noise 段階で使う sampler 方法です。", ko: "high-noise 단계에 사용하는 샘플러 방식입니다." } },
    { flag: "--scheduler <string>", desc: { en: "Sigma scheduler such as discrete, karras, exponential, ays, and others.", "zh-CN": "sigma 调度器，例如 discrete、karras、exponential、ays 等。", "zh-TW": "sigma 排程器，例如 discrete、karras、exponential、ays 等。", ja: "sigma scheduler です。discrete、karras、exponential、ays などが使えます。", ko: "sigma 스케줄러입니다. discrete, karras, exponential, ays 등을 사용할 수 있습니다." } },
    { flag: "--sigmas <string>", desc: { en: "Comma-separated custom sigma values.", "zh-CN": "逗号分隔的自定义 sigma 值。", "zh-TW": "逗號分隔的自定義 sigma 值。", ja: "カンマ区切りの custom sigma 値です。", ko: "쉼표로 구분한 사용자 지정 sigma 값입니다." } },
    { flag: "--skip-layers <string>", desc: { en: "Layers to skip for SLG steps.", "zh-CN": "SLG 阶段要跳过的层。", "zh-TW": "SLG 階段要跳過的層。", ja: "SLG ステップでスキップする層です。", ko: "SLG 단계에서 건너뛸 레이어입니다." } },
    { flag: "--high-noise-skip-layers <string>", desc: { en: "Layers to skip during high-noise SLG steps.", "zh-CN": "高噪声 SLG 阶段要跳过的层。", "zh-TW": "高噪聲 SLG 階段要跳過的層。", ja: "high-noise SLG ステップでスキップする層です。", ko: "high-noise SLG 단계에서 건너뛸 레이어입니다." } },
    { flag: "-r, --ref-image <string>", desc: { en: "Reference image for Flux Kontext models. Can be used multiple times.", "zh-CN": "Flux Kontext 模型的参考图，可重复使用多次。", "zh-TW": "Flux Kontext 模型的參考圖，可重複使用多次。", ja: "Flux Kontext モデル向け reference image です。複数回指定できます。", ko: "Flux Kontext 모델용 reference image 입니다. 여러 번 지정할 수 있습니다." } },
    { flag: "--cache-mode <string>", desc: { en: "Caching method such as easycache, ucache, dbcache, taylorseer, cache-dit, or spectrum.", "zh-CN": "缓存方式，例如 easycache、ucache、dbcache、taylorseer、cache-dit、spectrum。", "zh-TW": "快取方式，例如 easycache、ucache、dbcache、taylorseer、cache-dit、spectrum。", ja: "cache 方式です。easycache、ucache、dbcache、taylorseer、cache-dit、spectrum などを使えます。", ko: "캐시 방식입니다. easycache, ucache, dbcache, taylorseer, cache-dit, spectrum 등을 사용할 수 있습니다." } },
    { flag: "--cache-option <string>", desc: { en: "Comma-separated cache parameters. Supported keys depend on cache mode.", "zh-CN": "逗号分隔的缓存参数；支持的键取决于 cache mode。", "zh-TW": "逗號分隔的快取參數；支援的鍵取決於 cache mode。", ja: "カンマ区切りの cache パラメータです。使えるキーは cache mode に依存します。", ko: "쉼표로 구분한 캐시 파라미터입니다. 사용할 수 있는 키는 cache mode 에 따라 달라집니다." } },
    { flag: "--scm-mask <string>", desc: { en: "Comma-separated 0/1 SCM step mask for cache-dit.", "zh-CN": "cache-dit 使用的 0/1 逗号分隔 SCM 步骤 mask。", "zh-TW": "cache-dit 使用的 0/1 逗號分隔 SCM 步驟 mask。", ja: "cache-dit 用の 0/1 カンマ区切り SCM step mask です。", ko: "cache-dit 용 0/1 쉼표 구분 SCM step mask 입니다." } },
    { flag: "--scm-policy <string>", desc: { en: "SCM policy: dynamic or static.", "zh-CN": "SCM 策略：`dynamic` 或 `static`。", "zh-TW": "SCM 策略：`dynamic` 或 `static`。", ja: "SCM policy です。`dynamic` または `static`。", ko: "SCM 정책입니다. `dynamic` 또는 `static`." } }
  );

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
    directoryGallery: [],
    discoveries: loadJson(STORAGE_KEYS.discoveries, {}),
    formValues: loadJson(STORAGE_KEYS.formValues, {}),
    onboarding: { ...DEFAULT_ONBOARDING, ...loadJson(STORAGE_KEYS.onboarding, DEFAULT_ONBOARDING), isOpen: false },
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
    directoryGalleryLoading: false,
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
    renderOnboarding();
    maybeStartOnboarding();
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
      "samplerList", "schedulerList", "formatList", "openWizardBtn", "wizardOverlay",
      "wizardBackdrop", "closeWizardBtn", "wizardTitle", "wizardProgressBar",
      "wizardStepCount", "wizardStepBadge", "wizardNav", "wizardContent",
      "wizardBackBtn", "wizardSkipBtn", "wizardNextBtn"
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
    el.openWizardBtn.addEventListener("click", () => {
      closeSettingsPanel();
      openOnboardingWizard(state.onboarding.completed ? 0 : state.onboarding.lastStep);
    });
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
    el.wizardBackdrop.addEventListener("click", () => closeOnboardingWizard());
    el.closeWizardBtn.addEventListener("click", () => closeOnboardingWizard());
    el.wizardSkipBtn.addEventListener("click", () => closeOnboardingWizard());
    el.wizardBackBtn.addEventListener("click", () => setOnboardingStep(state.onboarding.lastStep - 1));
    el.wizardNextBtn.addEventListener("click", advanceOnboardingStep);
    el.wizardNav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-wizard-step]");
      if (!button) return;
      setOnboardingStep(Number(button.dataset.wizardStep));
    });
    el.wizardContent.addEventListener("click", (event) => {
      void handleWizardContentClick(event);
    });
    el.wizardContent.addEventListener("change", handleWizardContentChange);
    el.wizardContent.addEventListener("input", handleWizardContentInput);

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
      if (event.key !== "Escape") return;
      if (state.onboarding.isOpen) {
        closeOnboardingWizard();
        return;
      }
      closePanels();
    });
  }

  function hydrateState() {
    state.settings = { ...DEFAULT_SETTINGS, ...state.settings };
    state.onboarding = { ...DEFAULT_ONBOARDING, ...state.onboarding, isOpen: false };
    state.capabilities = state.discoveries.capabilities || null;
    syncSettingsControls();
    syncDiscoveryIntoDatalists();
    updateHeroChips();
  }

  function persistSettings() {
    safeWrite(STORAGE_KEYS.settings, state.settings);
    syncSettingsControls();
    updateHeroChips();
  }

  function syncSettingsControls() {
    el.languageSelect.value = state.settings.language;
    el.paletteSelect.value = state.settings.palette;
    el.modeSelect.value = state.settings.mode;
    el.apiUrlInput.value = state.settings.apiUrl;
    el.autoSaveCheckbox.checked = Boolean(state.settings.autoSave);

    const wizardLanguageSelect = document.getElementById("wizardLanguageSelect");
    const wizardPaletteSelect = document.getElementById("wizardPaletteSelect");
    const wizardModeSelect = document.getElementById("wizardModeSelect");
    const wizardApiUrlInput = document.getElementById("wizardApiUrlInput");

    if (wizardLanguageSelect) wizardLanguageSelect.value = state.settings.language;
    if (wizardPaletteSelect) wizardPaletteSelect.value = state.settings.palette;
    if (wizardModeSelect) wizardModeSelect.value = state.settings.mode;
    if (wizardApiUrlInput && document.activeElement !== wizardApiUrlInput) wizardApiUrlInput.value = state.settings.apiUrl;
  }

  function saveSettings() {
    state.settings.apiUrl = normalizeBaseUrl(el.apiUrlInput.value);
    persistSettings();
    renderOnboarding();
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

  function tf(key, values = {}) {
    return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), t(key));
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
    el.closeWizardBtn.title = t("wizardClose");
    el.closeWizardBtn.setAttribute("aria-label", t("wizardClose"));
    el.wizardBackdrop.setAttribute("aria-label", t("wizardClose"));
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
    if (state.dirHandle) void refreshDirectoryGallery();
    renderOnboarding();
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

  function persistOnboarding() {
    safeWrite(STORAGE_KEYS.onboarding, {
      seen: Boolean(state.onboarding.seen),
      completed: Boolean(state.onboarding.completed),
      lastStep: normalizeWizardStep(state.onboarding.lastStep),
      lastCheckedAt: Number(state.onboarding.lastCheckedAt || 0)
    });
  }

  function maybeStartOnboarding() {
    if (isMobileDefaultWizardSuppressed()) return;
    if (state.onboarding.seen) return;
    window.setTimeout(() => openOnboardingWizard(0), 120);
  }

  function isMobileDefaultWizardSuppressed() {
    const narrowViewport = window.matchMedia?.("(max-width: 768px)")?.matches;
    const mobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || "");
    return Boolean(narrowViewport || mobileUa);
  }

  function normalizeWizardStep(value) {
    const step = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : 0;
    return Math.min(Math.max(step, 0), ONBOARDING_STEPS.length - 1);
  }

  function openOnboardingWizard(step = 0) {
    closePanels();
    state.onboarding.isOpen = true;
    state.onboarding.seen = true;
    state.onboarding.lastStep = normalizeWizardStep(step);
    persistOnboarding();
    renderOnboarding();
  }

  function closeOnboardingWizard(options = {}) {
    state.onboarding.isOpen = false;
    if (options.completed) state.onboarding.completed = true;
    persistOnboarding();
    renderOnboarding();
    if (options.completed) toast("toastSuccess", "wizardCompletedToast");
  }

  function setOnboardingStep(step) {
    state.onboarding.lastStep = normalizeWizardStep(step);
    persistOnboarding();
    renderOnboarding();
  }

  function advanceOnboardingStep() {
    if (state.onboarding.lastStep >= ONBOARDING_STEPS.length - 1) {
      setActiveTab("dashboard");
      closeOnboardingWizard({ completed: true });
      return;
    }
    setOnboardingStep(state.onboarding.lastStep + 1);
  }

  async function handleWizardContentClick(event) {
    const actionNode = event.target.closest("[data-wizard-action]");
    if (!actionNode) return;

    if (actionNode.dataset.wizardAction === "save-api") {
      const input = document.getElementById("wizardApiUrlInput");
      if (input) el.apiUrlInput.value = input.value;
      saveSettings();
      return;
    }

    if (actionNode.dataset.wizardAction === "check-api") {
      const input = document.getElementById("wizardApiUrlInput");
      if (input) el.apiUrlInput.value = input.value;
      await checkConnections();
      renderOnboarding();
      return;
    }

    if (actionNode.dataset.wizardAction === "bind-imgs") {
      await bindImgsDirectory();
      renderOnboarding();
      return;
    }

    if (actionNode.dataset.wizardAction === "forget-imgs") {
      await forgetImgsDirectory();
      renderOnboarding();
    }
  }

  function handleWizardContentChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "wizardLanguageSelect") {
      state.settings.language = target.value;
      persistSettings();
      applyLanguage();
      return;
    }

    if (target.id === "wizardPaletteSelect") {
      state.settings.palette = target.value;
      persistSettings();
      applyTheme();
      return;
    }

    if (target.id === "wizardModeSelect") {
      state.settings.mode = target.value;
      persistSettings();
      applyTheme();
    }
  }

  function handleWizardContentInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === "wizardApiUrlInput") el.apiUrlInput.value = target.value;
  }

  function renderOnboarding() {
    const open = Boolean(state.onboarding.isOpen);
    el.wizardOverlay.hidden = !open;
    el.wizardOverlay.setAttribute("aria-hidden", String(!open));
    el.wizardOverlay.classList.toggle("on", open);
    document.body.classList.toggle("wizard-open", open);
    if (!open) return;

    const stepIndex = normalizeWizardStep(state.onboarding.lastStep);
    const step = ONBOARDING_STEPS[stepIndex];
    const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;

    el.wizardTitle.textContent = t(step.titleKey);
    el.wizardStepCount.textContent = tf("wizardStepCount", { current: stepIndex + 1, total: ONBOARDING_STEPS.length });
    el.wizardStepBadge.textContent = state.onboarding.completed ? t("wizardCompletedBadge") : t("wizardStatusCurrent");
    el.wizardStepBadge.className = `wizard-step-badge ${state.onboarding.completed ? "ok" : ""}`;
    el.wizardProgressBar.style.width = `${progress}%`;
    el.wizardBackBtn.disabled = stepIndex === 0;
    el.wizardNextBtn.textContent = stepIndex === ONBOARDING_STEPS.length - 1 ? t("wizardFinishCta") : t("wizardNext");

    el.wizardNav.innerHTML = ONBOARDING_STEPS.map((item, index) => {
      const stateText = index < stepIndex || (state.onboarding.completed && index === stepIndex)
        ? t("wizardStatusDone")
        : index === stepIndex
          ? t("wizardStatusCurrent")
          : "";
      return `<button class="wizard-nav-item ${index === stepIndex ? "active" : ""}" type="button" data-wizard-step="${index}"><span class="wizard-nav-index">${index + 1}</span><span class="wizard-nav-copy"><strong>${escapeHtml(t(item.navKey))}</strong></span><span class="wizard-nav-state">${escapeHtml(stateText)}</span></button>`;
    }).join("");

    el.wizardContent.innerHTML = renderOnboardingStep(step.key, step);
    syncSettingsControls();
  }

  function renderOnboardingStep(stepKey, step) {
    const origin = window.location?.origin;
    const suggestedOrigin = origin && origin !== "null" && /^https?:/i.test(origin) ? origin : "http://127.0.0.1:1234";
    const apiValue = state.settings.apiUrl || "";
    const apiStatus = apiValue ? apiValue : t("wizardApiStatusEmpty");
    const folderState = state.dirHandle ? `${t("wizardStorageStatusReady")} · ${state.dirHandle.name}` : t("wizardStorageStatusEmpty");
    const browserSupport = window.showDirectoryPicker ? t("wizardStorageBrowserReady") : t("wizardStorageBrowserMissing");

    if (stepKey === "welcome") {
      return `<article class="wizard-panel wizard-panel-hero"><div><span class="wizard-panel-kicker">${escapeHtml(t("wizardLabel"))}</span><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></div><div class="wizard-pill-row"><span class="pill">${escapeHtml(t("language"))}</span><span class="pill">${escapeHtml(t("mode"))}</span><span class="pill">${escapeHtml(t("palette"))}</span></div></article><div class="wizard-grid wizard-grid-3"><label class="compact-field wizard-field"><span>${escapeHtml(t("language"))}</span><select id="wizardLanguageSelect">${renderWizardLanguageOptions()}</select></label><label class="compact-field wizard-field"><span>${escapeHtml(t("mode"))}</span><select id="wizardModeSelect">${renderWizardModeOptions()}</select></label><label class="compact-field wizard-field"><span>${escapeHtml(t("palette"))}</span><select id="wizardPaletteSelect">${renderWizardPaletteOptions()}</select></label></div><div class="wizard-note">${escapeHtml(t("wizardWelcomeNote"))}</div>`;
    }

    if (stepKey === "server") {
      return `<article class="wizard-panel"><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></article><div class="wizard-grid wizard-grid-2"><article class="wizard-card"><h4>${escapeHtml(t("wizardServerDownloadTitle"))}</h4><p>${escapeHtml(t("wizardServerDownloadDesc"))}</p><p><a class="wizard-link" href="${escapeAttr(SDCPP_REPO_URL)}" target="_blank" rel="noreferrer noopener">${escapeHtml(SDCPP_REPO_URL)}</a></p><p><a class="wizard-link" href="${escapeAttr(SDCPP_RELEASES_URL)}" target="_blank" rel="noreferrer noopener">${escapeHtml(SDCPP_RELEASES_URL)}</a></p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardServerMatchTitle"))}</h4><ul class="wizard-list"><li>${escapeHtml(t("wizardServerMatch1"))}</li><li>${escapeHtml(t("wizardServerMatch2"))}</li><li>${escapeHtml(t("wizardServerMatch3"))}</li><li>${escapeHtml(t("wizardServerMatch4"))}</li></ul></article><article class="wizard-card"><h4>${escapeHtml(t("wizardServerPrepareTitle"))}</h4><ul class="wizard-list"><li>${escapeHtml(t("wizardServerPrepare1"))}</li><li>${escapeHtml(t("wizardServerPrepare2"))}</li><li>${escapeHtml(t("wizardServerPrepare3"))}</li><li>${escapeHtml(t("wizardServerPrepare4"))}</li></ul></article><article class="wizard-card"><h4>${escapeHtml(t("wizardServerLaunchTitle"))}</h4><p>${escapeHtml(t("wizardServerLaunchDesc"))}</p><div class="wizard-code-label">${escapeHtml(t("wizardServerExampleLabel"))}</div><pre class="wizard-code">${escapeHtml(SD_SERVER_START_COMMAND)}</pre></article><article class="wizard-card"><h4>${escapeHtml(t("wizardServerParamsTitle"))}</h4><ul class="wizard-list"><li>${escapeHtml(t("wizardServerItem1"))}</li><li>${escapeHtml(t("wizardServerItem2"))}</li><li>${escapeHtml(t("wizardServerItem3"))}</li><li>${escapeHtml(t("wizardServerItem5"))}</li><li>${escapeHtml(t("wizardServerItem6"))}</li><li>${escapeHtml(t("wizardServerItem7"))}</li></ul></article><article class="wizard-card"><h4>${escapeHtml(t("wizardServerReadyTitle"))}</h4><ul class="wizard-list"><li>${escapeHtml(t("wizardServerItem4"))}</li><li><code>http://127.0.0.1:1234/</code></li><li><code>/sdcpp/v1</code>, <code>/v1</code>, <code>/sdapi/v1</code></li><li>${escapeHtml(t("wizardServerReadyHint"))}</li></ul></article></div><article class="wizard-panel"><h3>${escapeHtml(t("wizardServerExamplesTitle"))}</h3><p>${escapeHtml(t("wizardServerExamplesDesc"))}</p></article>${renderServerExamples()}<article class="wizard-panel"><h3>${escapeHtml(t("wizardServerAllParamsTitle"))}</h3><p>${escapeHtml(t("wizardServerAllParamsDesc"))}</p></article>${renderServerParameterGroups()}<div class="wizard-note">${escapeHtml(t("wizardServerHint"))}</div>`;
    }

    if (stepKey === "network") {
      return `<article class="wizard-panel"><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></article><div class="wizard-grid wizard-grid-3"><article class="wizard-card"><h4>${escapeHtml(t("wizardNetworkPortTitle"))}</h4><p>${escapeHtml(t("wizardNetworkPortDesc"))}</p><pre class="wizard-code">${escapeHtml(SD_SERVER_LISTEN_COMMAND)}</pre></article><article class="wizard-card"><h4>${escapeHtml(t("wizardNetworkProxyTitle"))}</h4><p>${escapeHtml(t("wizardNetworkProxyDesc"))}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardNetworkTlsTitle"))}</h4><p>${escapeHtml(t("wizardNetworkTlsDesc"))}</p></article></div>`;
    }

    if (stepKey === "api") {
      return `<article class="wizard-panel"><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></article><label class="field wizard-field"><span>${escapeHtml(t("apiUrl"))}</span><input id="wizardApiUrlInput" type="url" placeholder="http://127.0.0.1:1234" value="${escapeAttr(apiValue)}"></label><div class="toolbar compact-toolbar"><button class="primary-button" type="button" data-wizard-action="save-api">${escapeHtml(t("saveSettings"))}</button><button class="ghost-button" type="button" data-wizard-action="check-api">${escapeHtml(t("checkConnection"))}</button></div><div class="wizard-grid wizard-grid-3"><article class="wizard-card"><h4>${escapeHtml(t("wizardApiStatusTitle"))}</h4><p>${escapeHtml(apiStatus)}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardApiHintTitle1"))}</h4><p>${escapeHtml(tf("wizardApiHint1", { origin: suggestedOrigin }))}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardApiHintTitle2"))}</h4><p>${escapeHtml(t("wizardApiHint2"))}</p></article></div>${renderWizardConnectionResults()}<div class="wizard-note">${escapeHtml(t("wizardApiHint3"))}</div>`;
    }

    if (stepKey === "storage") {
      return `<article class="wizard-panel"><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></article><div class="toolbar compact-toolbar"><button class="primary-button" type="button" data-wizard-action="bind-imgs">${escapeHtml(t("bindImgs"))}</button><button class="ghost-button" type="button" data-wizard-action="forget-imgs">${escapeHtml(t("releaseImgs"))}</button></div><div class="wizard-grid wizard-grid-2"><article class="wizard-card"><h4>${escapeHtml(t("wizardStorageStatusTitle"))}</h4><p>${escapeHtml(folderState)}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardStorageBrowserTitle"))}</h4><p>${escapeHtml(browserSupport)}</p></article></div><div class="wizard-note">${escapeHtml(t("saveHint"))}</div>`;
    }

    return `<article class="wizard-panel wizard-panel-hero"><div><span class="wizard-panel-kicker">${escapeHtml(t("wizardStepFinish"))}</span><h3>${escapeHtml(t(step.titleKey))}</h3><p>${escapeHtml(t(step.descKey))}</p></div></article><div class="wizard-grid wizard-grid-2"><article class="wizard-card"><h4>${escapeHtml(t("tabDashboard"))}</h4><p>${escapeHtml(t("wizardFeatureDashboardDesc"))}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardFeatureCompatTitle"))}</h4><p>${escapeHtml(t("wizardFeatureCompatDesc"))}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardFeatureNativeTitle"))}</h4><p>${escapeHtml(t("wizardFeatureNativeDesc"))}</p></article><article class="wizard-card"><h4>${escapeHtml(t("wizardFeatureGalleryTitle"))}</h4><p>${escapeHtml(t("wizardFeatureGalleryDesc"))}</p></article></div><div class="wizard-note">${escapeHtml(t("wizardFinishNote"))}</div>`;
  }

  function renderWizardLanguageOptions() {
    return [
      { value: "auto", label: t("autoLanguage") },
      { value: "zh-CN", label: "简体中文" },
      { value: "zh-TW", label: "繁體中文" },
      { value: "en", label: "English" },
      { value: "ja", label: "日本語" },
      { value: "ko", label: "한국어" }
    ].map((item) => `<option value="${escapeAttr(item.value)}"${item.value === state.settings.language ? " selected" : ""}>${escapeHtml(item.label)}</option>`).join("");
  }

  function renderWizardPaletteOptions() {
    return ["green", "blue", "purple", "yellow", "cyan", "red"]
      .map((value) => `<option value="${escapeAttr(value)}"${value === state.settings.palette ? " selected" : ""}>${escapeHtml(t(`palette${capitalize(value)}`))}</option>`)
      .join("");
  }

  function renderWizardModeOptions() {
    return ["auto", "day", "twilight", "night", "black"]
      .map((value) => `<option value="${escapeAttr(value)}"${value === state.settings.mode ? " selected" : ""}>${escapeHtml(t(`mode${capitalize(value)}`))}</option>`)
      .join("");
  }

  function renderWizardConnectionResults() {
    const items = [
      { label: t("familyOpenai"), info: state.connection.openai },
      { label: t("familySdapi"), info: state.connection.sdapi },
      { label: t("familySdcpp"), info: state.connection.sdcpp }
    ];
    const checkedText = state.onboarding.lastCheckedAt
      ? `${t("wizardApiLastCheck")}: ${formatTime(state.onboarding.lastCheckedAt)}`
      : t("wizardApiNeverChecked");
    return `<div class="wizard-grid wizard-grid-3"><article class="wizard-card wizard-card-wide"><h4>${escapeHtml(t("wizardApiResultsTitle"))}</h4><p>${escapeHtml(checkedText)}</p></article>${items.map(({ label, info }) => {
      const statusText = info.status === "ok" ? t("connectionOk") : info.status === "bad" ? t("connectionFail") : t("connectionIdle");
      const statusClass = info.status === "ok" ? "ok" : info.status === "bad" ? "bad" : "";
      return `<article class="wizard-card"><div class="wizard-card-heading"><h4>${escapeHtml(label)}</h4><span class="pill ${statusClass}">${escapeHtml(statusText)}</span></div><p>${escapeHtml(info.detail || "-")}</p></article>`;
    }).join("")}</div>`;
  }

  function tl(value) {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    return value[state.activeLanguage] || value.en || Object.values(value)[0] || "";
  }

  function renderServerExamples() {
    return `<div class="wizard-grid wizard-grid-2">${SD_SERVER_EXAMPLES.map((item) => `<article class="wizard-card"><h4>${escapeHtml(tl(item.title))}</h4><p>${escapeHtml(tl(item.description))}</p><pre class="wizard-code">${escapeHtml(item.command)}</pre></article>`).join("")}</div>`;
  }

  function renderServerParameterGroups() {
    return `<div class="wizard-grid">${SD_SERVER_PARAM_GROUPS.map((group, index) => `<details class="wizard-details"${index === 0 ? " open" : ""}><summary><span>${escapeHtml(tl(group.title))}</span><span class="wizard-details-count">${group.options.length}</span></summary><div class="wizard-param-list">${group.options.map((item) => `<article class="wizard-param-item"><code class="wizard-param-flag">${escapeHtml(item.flag)}</code><p>${escapeHtml(tl(item.desc))}</p></article>`).join("")}</div></details>`).join("")}</div>`;
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
      renderOnboarding();
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
    state.onboarding.lastCheckedAt = Date.now();
    persistOnboarding();
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
    renderOnboarding();
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
    const items = getGalleryItems().slice(0, 8);
    el.recentHistoryList.innerHTML = items.length
      ? items.map((item) => `<div class="history-row"><strong>${escapeHtml(item.endpoint)}</strong><span>${escapeHtml((item.prompt || "").slice(0, 110) || "-")}</span><code>${escapeHtml(formatTime(item.createdAt))}${item.fileName ? ` · ${escapeHtml(item.fileName)}` : ""}</code></div>`).join("")
      : `<div class="empty-state">${escapeHtml(t("recentEmpty"))}</div>`;
  }

  function renderGallery() {
    const query = (el.gallerySearchInput.value || "").trim().toLowerCase();
    const items = getGalleryItems().filter((item) => !query || [item.prompt, item.endpoint, item.fileName, item.apiFamily].join(" ").toLowerCase().includes(query));
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
    const entry = findGalleryEntryById(state.gallerySelectedId);
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

  function getGalleryItems() {
    const seen = new Set();
    const items = [];
    for (const entry of state.gallery) {
      const key = entry.fileName ? `file:${entry.fileName.toLowerCase()}` : `id:${entry.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(entry);
    }
    for (const entry of state.directoryGallery) {
      const key = entry.fileName ? `file:${entry.fileName.toLowerCase()}` : `id:${entry.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(entry);
    }
    return items.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  }

  function findGalleryEntryById(id) {
    if (!id) return null;
    return getGalleryItems().find((item) => item.id === id) || null;
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
      renderOnboarding();
      return;
    }
    try {
      const handle = await window.showDirectoryPicker({ id: "sdcpp-imgs", mode: "readwrite" });
      if (!(await ensurePermission(handle, true))) {
        renderOnboarding();
        return;
      }
      state.dirHandle = handle;
      await saveDirectoryHandle(handle);
      await refreshDirectoryGallery();
      updateHeroChips();
      renderOnboarding();
      toast("toastSuccess", "toastFolderBound", handle.name);
    } catch (error) {
      if (error?.name !== "AbortError") toast("toastError", "bindImgs", error.message || String(error));
      renderOnboarding();
    }
  }

  async function forgetImgsDirectory() {
    state.dirHandle = null;
    state.directoryGallery = [];
    try {
      const db = await openHandleDb();
      const tx = db.transaction("handles", "readwrite");
      tx.objectStore("handles").delete("imgs");
      await txDone(tx);
    } catch (_error) {
      // ignore
    }
    updateHeroChips();
    renderOnboarding();
    renderGallery();
    renderRecentHistory();
    toast("toastInfo", "toastFolderForgotten");
  }

  async function loadDirectoryHandle() {
    state.dirHandle = await getSavedDirectoryHandle();
    await refreshDirectoryGallery();
    updateHeroChips();
    renderOnboarding();
  }

  async function ensureDirectoryHandle(write = true) {
    if (!state.dirHandle) state.dirHandle = await getSavedDirectoryHandle();
    if (!state.dirHandle) return null;
    return (await ensurePermission(state.dirHandle, write)) ? state.dirHandle : null;
  }

  async function refreshDirectoryGallery() {
    if (state.directoryGalleryLoading) return;
    if (!state.dirHandle) {
      state.directoryGallery = [];
      renderGallery();
      renderRecentHistory();
      return;
    }
    state.directoryGalleryLoading = true;
    try {
      const handle = await ensureDirectoryHandle(false);
      if (!handle) {
        state.directoryGallery = [];
        renderGallery();
        renderRecentHistory();
        return;
      }
      state.directoryGallery = await loadGalleryEntriesFromDirectory(handle);
      renderGallery();
      renderRecentHistory();
    } catch (_error) {
      state.directoryGallery = [];
      renderGallery();
      renderRecentHistory();
    } finally {
      state.directoryGalleryLoading = false;
    }
  }

  async function loadGalleryEntriesFromDirectory(handle) {
    const fileHandles = [];
    for await (const [name, entryHandle] of handle.entries()) {
      if (entryHandle.kind !== "file") continue;
      if (!isGalleryImageFile(name)) continue;
      fileHandles.push({ name, handle: entryHandle });
    }

    const loaded = [];
    for (const item of fileHandles) {
      try {
        const file = await item.handle.getFile();
        const metadata = await tryReadGalleryMetadata(handle, file.name);
        const dataUrl = await fileToDataUrl(file);
        loaded.push({
          id: `dir:${file.name}`,
          createdAt: metadata?.createdAt || file.lastModified || Date.now(),
          apiFamily: metadata?.apiFamily || "imgs",
          endpoint: metadata?.endpoint || t("folderGalleryLabel"),
          prompt: metadata?.prompt || metadata?.parameters?.prompt || "",
          parameters: metadata?.parameters || {},
          fileName: file.name,
          format: inferImageFormat(file.name, file.type),
          saved: true,
          thumbDataUrl: await createThumbnail(dataUrl),
          jobId: metadata?.jobId || ""
        });
      } catch (_error) {
        // Skip unreadable files and continue loading the rest of the folder.
      }
    }

    return loaded.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  }

  async function tryReadGalleryMetadata(dirHandle, imageFileName) {
    try {
      const metadataHandle = await dirHandle.getFileHandle(imageFileName.replace(/\.[^.]+$/, ".json"));
      const metadataFile = await metadataHandle.getFile();
      return tryJson(await metadataFile.text()) || null;
    } catch (_error) {
      return null;
    }
  }

  function isGalleryImageFile(name) {
    return /\.(png|jpe?g|webp|bmp|gif)$/i.test(name || "");
  }

  function inferImageFormat(name, mimeType = "") {
    if (mimeType.startsWith("image/")) return mimeType.replace("image/", "");
    const match = String(name || "").match(/\.([^.]+)$/);
    return (match?.[1] || "png").toLowerCase();
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
