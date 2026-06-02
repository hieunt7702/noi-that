const fs = require('fs');

const files = ['index.html', 'index-v2.html'];

const originalSnippet = `<section class="elementor-section elementor-top-section elementor-element elementor-element-764f6bf9 elementor-hidden-tablet elementor-hidden-phone elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="764f6bf9" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
								<div class="elementor-column elementor-col-33 !w-1/3 elementor-top-column elementor-element elementor-element-4ee9ad24" data-id="4ee9ad24" data-element_type="column">
									<div class="elementor-column-wrap elementor-element-populated">
										<div class="elementor-widget-wrap">
											<div class="elementor-element elementor-element-3cd33b8b elementor-widget elementor-widget-noithat-texticon" data-id="3cd33b8b" data-element_type="widget" data-widget_type="noithat-texticon.default">
												<div class="elementor-widget-container">

													<div class="box-with-icon feature-2 !flex !items-center !justify-center !gap-2">

														<i class="noithat-icon fa fa-envelope-o" aria-hidden="true"></i>

														<div class="cont">
															<h3 class="icon-title !m-0 !p-0">hieunt270702@gmail.com</h3>
															<div class="icon-text"></div>
														</div><!--/.cont-->
													</div><!--/.box-icon-->

												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="elementor-column elementor-col-33 !w-1/3 elementor-top-column elementor-element elementor-element-7b7ed770" data-id="7b7ed770" data-element_type="column">
									<div class="elementor-column-wrap elementor-element-populated">
										<div class="elementor-widget-wrap">
											<div class="elementor-element elementor-element-5fff388a elementor-widget elementor-widget-noithat-texticon" data-id="5fff388a" data-element_type="widget" data-widget_type="noithat-texticon.default">
												<div class="elementor-widget-container">

													<div class="box-with-icon feature-2 !flex !items-center !justify-center !gap-2">

														<i class="noithat-icon fa fa-phone" aria-hidden="true"></i>

														<div class="cont">
															<h3 class="icon-title !m-0 !p-0">0334 689 521</h3>
															<div class="icon-text"></div>
														</div><!--/.cont-->
													</div><!--/.box-icon-->

												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="elementor-column elementor-col-33 !w-1/3 elementor-top-column elementor-element elementor-element-36988056" data-id="36988056" data-element_type="column">
									<div class="elementor-column-wrap elementor-element-populated">
										<div class="elementor-widget-wrap">
											<div class="elementor-element elementor-element-79059313 elementor-widget elementor-widget-noithat-texticon" data-id="79059313" data-element_type="widget" data-widget_type="noithat-texticon.default">
												<div class="elementor-widget-container">

													<div class="box-with-icon feature-2 !flex !items-center !justify-center !gap-2">

														<i class="noithat-icon fa fa-map-marker" aria-hidden="true"></i>

														<div class="cont">
															<h3 class="icon-title !m-0 !p-0">Hanoi, Vietnam</h3>
															<div class="icon-text"></div>
														</div><!--/.cont-->
													</div><!--/.box-icon-->

												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the block I put previously
    const sectionRegex = /<section[^>]*data-id="764f6bf9"[\s\S]*?<\/section>/;

    if (sectionRegex.test(content)) {
        content = content.replace(sectionRegex, originalSnippet);
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find section in ${file}`);
    }
});
