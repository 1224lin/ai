// 重置演示
function resetDemo() {
    const placeholder = document.getElementById('previewPlaceholder');
    const canvas = document.getElementById('imageCanvas');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const qualityResults = document.getElementById('qualityResults');
    const diseaseResults = document.getElementById('diseaseResults');
    const reportOutput = document.getElementById('reportOutput');
    
    // 重置图片预览
    placeholder.classList.remove('hidden');
    placeholder.innerHTML = '<i class="fas fa-eye"></i><p>上传眼底图片后，AI将自动分析</p>';
    canvas.classList.add('hidden');
    
    // 清除画布
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 重置按钮
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<i class="fas fa-search"></i> 开始AI分析';
    
    // 重置结果区域
    qualityResults.innerHTML = '<p>请上传图片进行质量评估</p>';
    diseaseResults.innerHTML = '<p>AI分析结果将在这里显示</p>';
    reportOutput.innerHTML = '<p>完整的筛查报告将在这里生成</p>';
    
    // 重置文件输入
    document.getElementById('imageUpload').value = '';
}