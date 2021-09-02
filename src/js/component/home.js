import React from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
export class Home extends React.Component {
	constructor() {
		super();

		this.state = {
			coverage: "",
			css: 'Click "Extract"',
			uncss: "",
			fromCss: 0,
			toCss: 0,
			js: 'Click "Extract"',
			unjs: "",
			fromJs: 0,
			toJs: 0
		};
	}

	generateCss = str => {
		const css_coverage = [...JSON.parse(str)];
		let css_used_bytes = 0;
		let css_total_bytes = 0;
		let covered_css = "";
		let uncovered_css = "";
		for (const entry of css_coverage) {
			if (entry.url.includes(".css")) {
				css_total_bytes += entry.text.length;
				uncovered_css += entry.text;
				console.log(
					`Total Bytes for ${entry.url}: ${entry.text.length}`
				);
				for (const range of entry.ranges) {
					// Fix indices due @media not being exported, see https://crbug.com/765088
					let mediaString = "";
					let mediaStart = entry.text.lastIndexOf("@media", range.start);
					if (mediaStart !== -1) {
						let mediaEnd = entry.text.indexOf("{", mediaStart);
						if (mediaEnd !== -1) {
							// Yeah, we found a previous @media rule
							if (!entry.text.slice(mediaStart, range.start).includes("}}")) {
								mediaString = entry.text.slice(mediaStart, mediaEnd);
							}
						}
					}
					css_used_bytes += range.end - range.start - 1 + mediaString.length;
					covered_css += mediaString + entry.text.slice(range.start, range.end);
					if (mediaString) {
						// Don't forget the closing bracket
						covered_css += "}";
					}
					uncovered_css = uncovered_css.replace(entry.text.slice(range.start, range.end), "");
				}
			}
		}
		this.setState({
			css: covered_css,
			uncss: uncovered_css,
			fromCss: css_total_bytes,
			toCss: css_used_bytes
		});
	};
	generateJs = str => {
		const js_coverage = [...JSON.parse(str)];
		let js_used_bytes = 0;
		let js_total_bytes = 0;
		let covered_js = "";
		let uncovered_js = "";
		for (const entry of js_coverage) {
			if (entry.url.includes(".js")) {
				js_total_bytes += entry.text.length;
				uncovered_js += entry.text;
				console.log(
					`Total Bytes for ${entry.url}: ${entry.text.length}`
				);
				for (const range of entry.ranges) {
					// Fix indices due @media not being exported, see https://crbug.com/765088
					let mediaString = "";
					let mediaStart = entry.text.lastIndexOf("@media", range.start);
					if (mediaStart !== -1) {
						let mediaEnd = entry.text.indexOf("{", mediaStart);
						if (mediaEnd !== -1) {
							// Yeah, we found a previous @media rule
							if (!entry.text.slice(mediaStart, range.start).includes("}}")) {
								mediaString = entry.text.slice(mediaStart, mediaEnd);
							}
						}
					}
					js_used_bytes += range.end - range.start - 1 + mediaString.length;
					covered_js += mediaString + entry.text.slice(range.start, range.end);
					if (mediaString) {

						covered_js += "}";
					}
					uncovered_js = uncovered_js.replace(entry.text.slice(range.start, range.end), "");
				}
			}
		}
		this.setState({
			css: covered_js,
			uncss: uncovered_js,
			fromJs: js_total_bytes,
			toJs: js_used_bytes
		});
	};

	render() {
		return (
			<div className="text-center mt-5">
				<h1>Coverage JSON to CSS converter</h1>
				<form
					onSubmit={e => {
						e.preventDefault();
						this.generateCss(this.state.coverage);
						this.generateJs(this.state.coverage);
					}}>
					<div className="form-group">
						<label htmlFor="jsonTextArea">
							1. Paste JSON content
						</label>
						<textarea
							className="form-control"
							id="jsonTextArea"
							rows="5"
							value={this.state.coverage}
							onChange={e =>
								this.setState({ coverage: e.target.value })
							}
							placeholder="Paste JSON content here"
						/>
					</div>
					<button className="btn btn-info">2. Extract</button>
				</form>
				<hr />
				<br />
				<div className="row">
					<div className="col col-md-6">
						<div className="form-group">
							<label htmlFor="jsonTextArea">Covered CSS</label>
							<textarea
								className="form-control"
								rows="10"
								style={{ whiteSpace: "pre" }}
								value={this.state.css}
								readOnly
							/>
						</div>
					</div>
					<div className="col col-md-6">
						<div className="form-group">
							<label htmlFor="jsonTextArea">Uncovered CSS</label>
							<textarea
								className="form-control"
								rows="10"
								style={{ whiteSpace: "pre" }}
								value={this.state.uncss}
								readOnly
							/>
						</div>
					</div>
				</div>
				
				<div className="row">
					<div className="col col-md-6">
						<div className="form-group">
							<label htmlFor="jsonTextArea">Covered JS</label>
							<textarea
								className="form-control"
								rows="10"
								style={{ whiteSpace: "pre" }}
								value={this.state.js}
								readOnly
							/>
						</div>
					</div>
					<div className="col col-md-6">
						<div className="form-group">
							<label htmlFor="jsonTextArea">Uncovered JS</label>
							<textarea
								className="form-control"
								rows="10"
								style={{ whiteSpace: "pre" }}
								value={this.state.unjs}
								readOnly
							/>
						</div>
					</div>
				</div>


				<h2>
					Original CSS: {this.state.fromCss} | Covered:{" "}
					{this.state.css.length} | Uncovered:{" "}
					{this.state.uncss.length}
				</h2>
				<h2>
					Original JS: {this.state.fromJs} | Covered:{" "}
					{this.state.js.length} | Uncovered:{" "}
					{this.state.unjs.length}
				</h2>
			</div>
		);
	}
}
