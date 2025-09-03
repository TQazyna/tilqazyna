<div class="main-page">
    <div class="main-page__in floated">
        <div class="main-page__left">
            <div class="main-slider floated">
                <?php foreach ($sliders as $slider) {?>
                    <div class="main-slider__item">
                        <img width="960" height="390" src="<?=$slider['img_slider']?>">
                        <a href="/article/<?echo $slider['id']."-".$slider['preview'].".html";?>"><div class="main-slider__text"><?=$slider['title']?></div></a>
                    </div>
                <?php }?>
            </div>
            <div class="main-page__blog-b floated">
                <a href="/profile" class="main-page__blog main-page__blog--galym floated">
                                    <span class="main-page__blog__text">
                                        Ғалым
                                        <svg version="1.1" class="main-page__blog__arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 10 16" enable-background="new 0 0 10 16" xml:space="preserve">
                                            <path fill="#FFFFFF" d="M9.631,7.205L1.984,0.309C1.516-0.115,0.771-0.1,0.321,0.339c-0.45,0.439-0.436,1.138,0.033,1.56L7.118,8l-6.765,6.102c-0.468,0.423-0.483,1.121-0.033,1.56C0.552,15.887,0.86,16,1.169,16c0.293,0,0.587-0.103,0.815-0.308l7.646-6.897C9.862,8.587,9.992,8.3,9.992,8S9.862,7.413,9.631,7.205z"/>
                                        </svg>
                                    </span>
                                    <span class="main-page__blog__tool-b">
                                        <svg class="main-page__blog__tool" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 69 69" enable-background="new 0 0 69 69" xml:space="preserve">
                                             <path opacity="0.15" d="M67.867,25.696c-0.998-3.886-2.66-7.512-5.011-10.796C55.907,5.191,46.38,0.388,34.538,0c-2.792-0.02-5.502,0.396-8.193,1.03C21.632,2.139,17.38,4.194,13.55,7.134c-5.417,4.16-9.273,9.45-11.569,15.886c-1.115,3.13-1.771,6.347-1.935,9.657c-0.254,5.125,0.552,10.081,2.517,14.845c0.712,1.721,1.549,3.369,2.505,4.967c0.225,0.377,0.596,0.713,0.442,1.252c-0.339,1.198-0.645,2.401-0.97,3.601c-0.773,2.838-1.545,5.678-2.325,8.516c-0.122,0.438-0.007,0.49,0.413,0.373c3.533-0.98,7.063-1.971,10.615-2.883c0.744-0.191,1.5-0.643,2.364-0.057c4.079,2.777,8.592,4.426,13.463,5.249c4.811,0.813,9.549,0.529,14.221-0.677c5.309-1.367,10.061-3.9,14.127-7.588c6.105-5.531,9.862-12.347,11.165-20.537C69.338,34.981,69.051,30.306,67.867,25.696z"/>
                                        </svg>
                                        <svg class="main-page__blog__tool--galym" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 44" enable-background="new 0 0 32 44" xml:space="preserve">
                                            <path fill="#FFFFFF" d="M21.31,31.741l-1.314,1.542l-0.969,1.139l-1.284-0.759l-1.741-1.031l-1.741,1.031l-1.283,0.758l-0.971-1.137l-1.314-1.544l-1.979,0.404L7.65,32.361V44h0.175l8.175-7.415L24.175,44h0.177V32.362l-1.063-0.218L21.31,31.741zM13.714,7.547c-3.947,0.898-6.705,4.377-6.705,8.46c0,0.495,0.397,0.897,0.891,0.897c0.493,0,0.891-0.402,0.889-0.899c0-3.186,2.237-6.008,5.318-6.708c0.479-0.109,0.78-0.589,0.673-1.072C14.67,7.74,14.191,7.44,13.714,7.547z M32,17.504l-1.764-2.522l1.326-2.783l-2.48-1.81l0.358-3.064l-2.932-0.9L25.859,3.41l-3.062,0.105l-1.584-2.639L18.35,1.979L16.001,0l-2.352,1.979l-2.862-1.103L9.202,3.515L6.14,3.409L5.49,6.423l-2.93,0.9l0.359,3.064l-2.483,1.811l1.328,2.783L0,17.504L2.153,19.7l-0.856,2.963l2.744,1.373l0.147,3.083l3.038,0.399l1.132,2.866l3.003-0.613l1.995,2.342L16,30.551l2.643,1.563l1.995-2.342l3.004,0.613l1.132-2.866l3.038-0.399l0.146-3.083l2.744-1.373L29.847,19.7L32,17.504z M28.579,18.439l-0.735,0.75l0.292,1.012l0.439,1.522l-1.41,0.704l-0.938,0.469l-0.051,1.053l-0.076,1.587l-1.561,0.205l-1.037,0.137l-0.387,0.979l-0.583,1.476l-1.543-0.315l-1.025-0.21l-0.681,0.802l-1.025,1.202l-1.357-0.804L16,28.473l-0.902,0.535l-1.359,0.804l-1.025-1.204l-0.681-0.8l-1.023,0.21l-1.543,0.315l-0.583-1.476l-0.387-0.979l-1.038-0.137l-1.562-0.205l-0.076-1.585L5.77,22.898l-0.937-0.468l-1.41-0.705l0.439-1.522l0.292-1.012l-0.734-0.75l-1.107-1.129l0.908-1.297l0.603-0.861l-0.453-0.951l-0.685-1.431l1.278-0.93l0.847-0.617L4.687,10.18L4.503,8.604l1.506-0.464l1-0.308L7.23,6.806l0.333-1.552L9.139,5.31l1.045,0.037l0.541-0.9l0.816-1.357l1.47,0.567l0.979,0.376l0.801-0.675l1.212-1.021l1.209,1.018l0.801,0.676l0.978-0.376l1.471-0.567l0.814,1.357l0.54,0.901l1.046-0.037l1.575-0.056l0.333,1.551l0.222,1.029l0.999,0.307l1.508,0.464l-0.185,1.575l-0.123,1.046l0.846,0.617l1.277,0.93l-0.684,1.432l-0.453,0.95l0.603,0.861l0.908,1.296L28.579,18.439z"/>
                                        </svg>
                                    </span>
                </a>
                <a href="/profile" class="main-page__blog main-page__blog--adisker floated">
                                    <span class="main-page__blog__text">
                                        Әдіскер
                                        <svg version="1.1" class="main-page__blog__arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 10 16" enable-background="new 0 0 10 16" xml:space="preserve">
                                            <path fill="#FFFFFF" d="M9.631,7.205L1.984,0.309C1.516-0.115,0.771-0.1,0.321,0.339c-0.45,0.439-0.436,1.138,0.033,1.56L7.118,8l-6.765,6.102c-0.468,0.423-0.483,1.121-0.033,1.56C0.552,15.887,0.86,16,1.169,16c0.293,0,0.587-0.103,0.815-0.308l7.646-6.897C9.862,8.587,9.992,8.3,9.992,8S9.862,7.413,9.631,7.205z"/>
                                        </svg>
                                    </span>
                                    <span class="main-page__blog__tool-b">
                                        <svg class="main-page__blog__tool" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 69 69" enable-background="new 0 0 69 69" xml:space="preserve">
                                             <path opacity="0.15" d="M67.867,25.696c-0.998-3.886-2.66-7.512-5.011-10.796C55.907,5.191,46.38,0.388,34.538,0c-2.792-0.02-5.502,0.396-8.193,1.03C21.632,2.139,17.38,4.194,13.55,7.134c-5.417,4.16-9.273,9.45-11.569,15.886c-1.115,3.13-1.771,6.347-1.935,9.657c-0.254,5.125,0.552,10.081,2.517,14.845c0.712,1.721,1.549,3.369,2.505,4.967c0.225,0.377,0.596,0.713,0.442,1.252c-0.339,1.198-0.645,2.401-0.97,3.601c-0.773,2.838-1.545,5.678-2.325,8.516c-0.122,0.438-0.007,0.49,0.413,0.373c3.533-0.98,7.063-1.971,10.615-2.883c0.744-0.191,1.5-0.643,2.364-0.057c4.079,2.777,8.592,4.426,13.463,5.249c4.811,0.813,9.549,0.529,14.221-0.677c5.309-1.367,10.061-3.9,14.127-7.588c6.105-5.531,9.862-12.347,11.165-20.537C69.338,34.981,69.051,30.306,67.867,25.696z"/>
                                        </svg>
                                        <svg class="main-page__blog__tool--book-write" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 41 37" enable-background="new 0 0 41 37" xml:space="preserve">
                                             <path fill="#FFFFFF" d="M32.702,33.387c-1.423-0.535-3.063-0.806-4.875-0.806c-4.448,0-8.68,1.593-9.954,2.117v-7.61l0.594,0.609V16.264c2.245-1.766,4.968-2.714,8.116-2.828l0.61-0.962c-3.697,0.004-6.891,1.062-9.488,3.145c-2.602-2.088-5.797-3.146-9.51-3.146c-3.467,0-6.065,0.944-6.174,0.984l-0.319,0.117v1.914C0.653,15.672,0,16,0,16.536c0,2.79,0,19.728,0,19.728H15.54C16.08,36.713,16.865,37,17.744,37c0.88,0,1.667-0.286,2.203-0.736H35.1c0,0,0-18.558,0-19.708l-2.397,4.64V33.387z M17.538,34.71c-1.291-0.497-5.734-2.078-10.185-2.078c-1.757,0-3.315,0.254-4.643,0.75V14.226c0.775-0.241,2.886-0.811,5.485-0.811c3.416,0,6.353,0.965,8.752,2.85v11.434l0.591-0.609V34.71z M4.702,16.744l0.208,0.738c5.248-1.301,9.972,1.105,10.019,1.13l0.396-0.667C15.123,17.842,10.275,15.364,4.702,16.744zM4.702,18.903L4.91,19.64c5.248-1.302,9.972,1.108,10.019,1.133l0.396-0.666C15.123,19.999,10.275,17.521,4.702,18.903zM4.702,20.933l0.208,0.736c5.248-1.3,9.972,1.108,10.019,1.131l0.396-0.664C15.123,22.028,10.275,19.55,4.702,20.933zM4.702,23.155l0.208,0.736c5.248-1.301,9.972,1.107,10.019,1.132l0.396-0.666C15.123,24.253,10.275,21.773,4.702,23.155zM4.702,25.216l0.208,0.736c5.248-1.301,9.972,1.107,10.019,1.131l0.396-0.666C15.123,26.313,10.275,23.835,4.702,25.216zM4.702,27.332l0.208,0.737c5.248-1.303,9.972,1.106,10.019,1.131l0.396-0.667C15.123,28.428,10.275,25.952,4.702,27.332zM4.702,29.453l0.208,0.735c5.248-1.3,9.972,1.105,10.019,1.131l0.396-0.664C15.123,30.548,10.275,28.072,4.702,29.453z M35.057,0l-2.459,4.728l0.012,0.004l-7.605,14.646l-0.665,7.706l6.511-4.916L38.534,7.42l0.011,0.007L41,2.697L35.057,0z M30.409,21.761l-3.717,2.804l-1.474-0.666l0.362-4.317l0.345-0.668l0.682,2.26l1.508-0.906l0.295,1.723l2.25-0.71L30.409,21.761z M38.446,4.981l-3.73-1.693l0.908-1.748l3.73,1.693L38.446,4.981z"/>
                                        </svg>
                                    </span>
                </a>
                <a href="/profile" class="main-page__blog main-page__blog--author floated">
                                    <span class="main-page__blog__text">
                                        Автор
                                        <svg version="1.1" class="main-page__blog__arrow" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 10 16" enable-background="new 0 0 10 16" xml:space="preserve">
                                            <path fill="#FFFFFF" d="M9.631,7.205L1.984,0.309C1.516-0.115,0.771-0.1,0.321,0.339c-0.45,0.439-0.436,1.138,0.033,1.56L7.118,8l-6.765,6.102c-0.468,0.423-0.483,1.121-0.033,1.56C0.552,15.887,0.86,16,1.169,16c0.293,0,0.587-0.103,0.815-0.308l7.646-6.897C9.862,8.587,9.992,8.3,9.992,8S9.862,7.413,9.631,7.205z"/>
                                        </svg>
                                    </span>
                                    <span class="main-page__blog__tool-b">
                                        <svg class="main-page__blog__tool" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 69 69" enable-background="new 0 0 69 69" xml:space="preserve">
                                             <path opacity="0.15" d="M67.867,25.696c-0.998-3.886-2.66-7.512-5.011-10.796C55.907,5.191,46.38,0.388,34.538,0c-2.792-0.02-5.502,0.396-8.193,1.03C21.632,2.139,17.38,4.194,13.55,7.134c-5.417,4.16-9.273,9.45-11.569,15.886c-1.115,3.13-1.771,6.347-1.935,9.657c-0.254,5.125,0.552,10.081,2.517,14.845c0.712,1.721,1.549,3.369,2.505,4.967c0.225,0.377,0.596,0.713,0.442,1.252c-0.339,1.198-0.645,2.401-0.97,3.601c-0.773,2.838-1.545,5.678-2.325,8.516c-0.122,0.438-0.007,0.49,0.413,0.373c3.533-0.98,7.063-1.971,10.615-2.883c0.744-0.191,1.5-0.643,2.364-0.057c4.079,2.777,8.592,4.426,13.463,5.249c4.811,0.813,9.549,0.529,14.221-0.677c5.309-1.367,10.061-3.9,14.127-7.588c6.105-5.531,9.862-12.347,11.165-20.537C69.338,34.981,69.051,30.306,67.867,25.696z"/>
                                        </svg>
                                        <svg class="main-page__blog__tool--book" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 38 30" enable-background="new 0 0 38 30" xml:space="preserve">
                                             <path fill="#FFFFFF" d="M36.496,3.875V1.347l-0.345-0.143C36.031,1.154,33.219,0,29.468,0c-4.02,0-7.481,1.295-10.299,3.846C16.353,1.295,12.891,0,8.872,0C5.119,0,2.307,1.154,2.189,1.205L1.843,1.347v2.342C0.708,3.914,0,4.315,0,4.971c0,3.414,0,24.131,0,24.131h16.828C17.409,29.651,18.261,30,19.213,30c0.951,0,1.804-0.349,2.385-0.898H38c0,0,0-22.934,0-24.131C37.998,4.438,37.426,4.089,36.496,3.875z M18.988,27.198c-1.396-0.608-6.208-2.541-11.026-2.541c-1.904,0-3.591,0.309-5.027,0.919V2.146C3.773,1.85,6.058,1.152,8.872,1.152c3.7,0,6.879,1.182,9.476,3.487v13.985l0.64-0.745V27.198z M35.404,25.582c-1.543-0.655-3.314-0.986-5.276-0.986c-4.816,0-9.399,1.95-10.778,2.591v-9.31l0.643,0.746V4.639c2.596-2.306,5.775-3.487,9.476-3.487c2.805,0,5.097,0.699,5.937,0.995V25.582z M5.092,5.228l0.226,0.901C11,4.538,16.112,7.484,16.164,7.514l0.429-0.815C16.375,6.569,11.125,3.538,5.092,5.228z M5.092,7.867l0.226,0.902C11,7.176,16.112,10.124,16.164,10.152l0.429-0.813C16.375,9.209,11.125,6.18,5.092,7.867z M5.092,10.349l0.226,0.901C11,9.66,16.112,12.604,16.164,12.634l0.429-0.815C16.375,11.691,11.125,8.661,5.092,10.349z M5.092,13.068l0.226,0.901c5.682-1.591,10.794,1.356,10.846,1.385l0.429-0.814C16.375,14.408,11.125,11.377,5.092,13.068z M5.092,15.587l0.226,0.902c5.682-1.591,10.794,1.354,10.846,1.386l0.429-0.816C16.375,16.93,11.125,13.9,5.092,15.587z M5.092,18.175l0.226,0.901c5.682-1.592,10.794,1.354,10.846,1.383l0.429-0.813C16.375,19.516,11.125,16.487,5.092,18.175z M5.092,20.771l0.226,0.9c5.682-1.592,10.794,1.355,10.846,1.384l0.429-0.812C16.375,22.111,11.125,19.08,5.092,20.771z M22.437,7.582c0.052-0.03,5.163-2.974,10.845-1.384l0.227-0.901c-6.033-1.688-11.281,1.342-11.501,1.472L22.437,7.582z M22.007,9.408l0.43,0.815c0.052-0.03,5.163-2.976,10.845-1.383l0.227-0.903C27.475,6.248,22.227,9.277,22.007,9.408z M22.007,11.888l0.43,0.815c0.052-0.03,5.163-2.976,10.845-1.385l0.227-0.902C27.475,8.731,22.227,11.76,22.007,11.888z M22.007,14.609l0.43,0.813c0.052-0.029,5.163-2.975,10.845-1.383l0.227-0.901C27.475,11.448,22.227,14.478,22.007,14.609z M22.007,17.129l0.43,0.814c0.052-0.03,5.163-2.975,10.845-1.384l0.227-0.903C27.475,13.969,22.227,16.998,22.007,17.129z M22.007,19.716l0.43,0.814c0.052-0.03,5.163-2.975,10.845-1.383l0.227-0.901C27.475,16.557,22.227,19.587,22.007,19.716z M22.007,22.311l0.43,0.812c0.052-0.027,5.163-2.976,10.845-1.382l0.227-0.901C27.475,19.15,22.227,22.181,22.007,22.311z"/>
                                        </svg>
                                    </span>
                </a>
            </div>
            <div class="main-page__title-b">
                <h3 class="news__title">Ақпарат</h3>
            </div>
            <div class="main-page__news-b floated">
                <?php
                $i = 1;
                foreach ($articles as $article) {?>
                    <?if($i == 1){?>
                        <div class="main-page__news-main">
                        <img width="630" height="420" src="<?=$article['img']?>" class="main-page__news-main__img"/>
                        <div class="main-page__views-b js-views-b">
                                <span class="main-page__views">
                                     <svg version="1.1" class="main-page__date-icon" viewBox="0 0 19 17" enable-background="new 0 0 19 17">
                                         <path fill="#CCCCCC" d="M13.424,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C14.457,0.459,13.994,0,13.424,0s-1.032,0.459-1.032,1.024v2.623C12.392,4.213,12.854,4.671,13.424,4.671z M8.197,3.072h2.607c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H8.197c-0.456,0-0.826,0.367-0.826,0.819S7.741,3.072,8.197,3.072z M18.174,1.434h-1.931c-0.456,0-0.826,0.367-0.826,0.819s0.37,0.819,0.826,0.819h1.104v3.482H1.652V3.072h1.105c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H0.827C0.37,1.434,0,1.876,0,2.329v13.852C0,16.633,0.37,17,0.827,17h17.347C18.631,17,19,16.633,19,16.181V2.329C19,1.876,18.631,1.434,18.174,1.434z M17.348,15.361H1.652V7.988h15.696V15.361zM5.576,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C6.609,0.459,6.146,0,5.576,0S4.543,0.459,4.543,1.024v2.623C4.543,4.213,5.006,4.671,5.576,4.671z"/>
                                     </svg>
                                     12.06.2016
                                </span>
                                   <span class="main-page__views">
                                     <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                         <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                     </svg>
                                     <?=$article['views']?>
                                </span>
                        </div>
                        <div class="main-page__news-main__text-b">
                            <div class="main-page__news-main__section">Ақпарат</div>
                            <div class="main-page__news-main__title"><?=$article['title']?></div>
                        </div>
                        <a href="/article/<?echo $article['id']."-".$article['preview'].".html";?>" class="main-page__news-main__link js-views-link"></a>
                    </div>
                    <?}else{?>
                        <div class="main-page__news">
                            <div class="main-page__news__img-b">
                                <img width="300" height="200" src="<?=$article['img']?>" class="main-page__news__img"/>
                                <div class="main-page__views-b js-views-b">
                                    <span class="main-page__views">
                                         <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                             <path fill="#CCCCCC" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                         </svg>
                                        <?=$article['views']?>
                                    </span>
                                       <span class="main-page__views">
                                         <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                             <path fill="#FFFFFF" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                         </svg>
                                           <?=$article['comments']?>
                                    </span>
                                </div>
                                <a href="/article/<?echo $article['id']."-".$article['preview'].".html";?>" class="main-page__news__link js-views-link"></a>
                            </div>
                            <div class="main-page__news__body">
                                <h2 class="main-page__news__section">ақпарат</h2>
                                <a href="/article/<?echo $article['id']."-".$article['preview'].".html";?>"><h3 class="main-page__news__title"><?=$article['title']?></h3></a>
                                <p class="main-page__news__text"><?php echo \common\models\Articles::preview($article['text']);?>...</p>
                            </div>
                        </div>
                    <?}?>
                <?php
                $i++;
                }?>
                <div class="main-page__news-bottom">
                    <a href="/news" class="main-page__news__all-link">
                        Барлық жаңалықтар
                        <svg class="main-page__news__all-link__icon" version="1.1" viewBox="0 0 15 12" enable-background="new 0 0 15 12" xml:space="preserve">
                                   <path fill="#FBAA66" d="M14.769,5.415L9.848,0.242C9.54-0.081,9.04-0.082,8.731,0.241c-0.309,0.322-0.31,0.847-0.001,1.17l3.577,3.761H0.789C0.354,5.172,0,5.542,0,5.999s0.354,0.827,0.789,0.827h11.519L8.73,10.587c-0.309,0.323-0.308,0.848,0.001,1.17c0.154,0.161,0.355,0.242,0.558,0.242s0.404-0.081,0.559-0.243l4.921-5.173C15.076,6.261,15.076,5.737,14.769,5.415z"/>
                                </svg>
                    </a>
                </div>
            </div>
        </div>
        <div class="sidebar">
            <div class="sidebar__top-b">
                <div class="sidebar__top">
                    <div class="sidebar__top__item">
                        <a href="/"><img src="/img/banner-right.jpg" class="sidebar__top__img"/></a>
                    </div>
                    <div class="sidebar__top__item">
                        <a href="/"><img src="/img/banner-right4.jpg" class="sidebar__top__img"/></a>
                    </div>
                </div>
            </div>
            <?php echo \frontend\widgets\More::widget();?>
            <?php echo \frontend\widgets\Popular::widget();?>

        </div>
    </div>

    <div class="main-page__tolganys-b">
        <div class="main-page__tolganys__title-b">
            <h2 class="main-page__tolganys__title">Толғаныс</h2>
            <div class="main-page__tolganys__sections"></div>
            <a href="" class="main-page__tolganys__all-link">
                Блог ашу
                <svg class="main-page__news__all-link__icon" version="1.1" viewBox="0 0 15 12" enable-background="new 0 0 15 12" xml:space="preserve">
		                         <path fill="#ffffff" d="M14.769,5.415L9.848,0.242C9.54-0.081,9.04-0.082,8.731,0.241c-0.309,0.322-0.31,0.847-0.001,1.17l3.577,3.761H0.789C0.354,5.172,0,5.542,0,5.999s0.354,0.827,0.789,0.827h11.519L8.73,10.587c-0.309,0.323-0.308,0.848,0.001,1.17c0.154,0.161,0.355,0.242,0.558,0.242s0.404-0.081,0.559-0.243l4.921-5.173C15.076,6.261,15.076,5.737,14.769,5.415z"/>
                            </svg>
            </a>
        </div>
        <div class="main-page__tolganys__items floated">
            <?php
            $i = 0;
            foreach ($blogs as $blog) {
            $i++;
                ?>
                <div class="main-page__tolganys__item">
                    <div class="main-page__tolganys__img-b">
                        <img width="300" height="200" src="<?=$blog['img']?>" class="main-page__tolganys__img">
                    </div>
                    <div class="main-page__tolganys__item__body">
                        <a href="/article/<?echo $blog['id']."-".$blog['preview'].".html";?>"><h3 class="main-page__tolganys__item__title"><?=$blog['title']?></h3></a>
                        <div class="main-page__tolganys__item__views-b">
                                    <span class="main-page__tolganys__item__views">
                                         <svg version="1.1" class="main-page__date-icon" viewBox="0 0 19 17" enable-background="new 0 0 19 17">
                                             <path fill="#999999" d="M13.424,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C14.457,0.459,13.994,0,13.424,0s-1.032,0.459-1.032,1.024v2.623C12.392,4.213,12.854,4.671,13.424,4.671z M8.197,3.072h2.607c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H8.197c-0.456,0-0.826,0.367-0.826,0.819S7.741,3.072,8.197,3.072z M18.174,1.434h-1.931c-0.456,0-0.826,0.367-0.826,0.819s0.37,0.819,0.826,0.819h1.104v3.482H1.652V3.072h1.105c0.456,0,0.826-0.367,0.826-0.819s-0.37-0.819-0.826-0.819H0.827C0.37,1.434,0,1.876,0,2.329v13.852C0,16.633,0.37,17,0.827,17h17.347C18.631,17,19,16.633,19,16.181V2.329C19,1.876,18.631,1.434,18.174,1.434z M17.348,15.361H1.652V7.988h15.696V15.361zM5.576,4.671c0.57,0,1.033-0.458,1.033-1.023V1.024C6.609,0.459,6.146,0,5.576,0S4.543,0.459,4.543,1.024v2.623C4.543,4.213,5.006,4.671,5.576,4.671z"/>
                                         </svg>
                                         1<?=$i?>.06.2016
                                    </span>
                                    <span class="main-page__tolganys__item__views">
                                        <svg version="1.1" class="main-page__views-icon" viewBox="0 0 21 12" enable-background="new 0 0 21 12">
                                            <path fill="#999999" d="M11.028,2.346c-1-0.138-1.994,0.112-2.8,0.705C6.565,4.274,6.23,6.591,7.48,8.217c0.606,0.789,1.492,1.3,2.492,1.438c0.178,0.024,0.358,0.037,0.536,0.037c0.814,0,1.602-0.256,2.263-0.743c1.662-1.222,1.998-3.539,0.748-5.166C12.913,2.994,12.028,2.483,11.028,2.346z M11.946,7.885c-0.514,0.378-1.147,0.537-1.782,0.449C9.528,8.246,8.963,7.921,8.577,7.418c-0.799-1.04-0.586-2.521,0.477-3.303c0.514-0.378,1.146-0.537,1.783-0.449c0.637,0.088,1.201,0.413,1.586,0.915C13.223,5.622,13.008,7.104,11.946,7.885zM11.212,4.418c-0.243,0-0.477,0.093-0.646,0.26c-0.171,0.164-0.267,0.394-0.267,0.629c0,0.233,0.096,0.462,0.267,0.629c0.169,0.164,0.403,0.26,0.646,0.26c0.24,0,0.476-0.096,0.645-0.26c0.172-0.167,0.268-0.396,0.268-0.629c0-0.235-0.096-0.465-0.268-0.629C11.688,4.511,11.452,4.418,11.212,4.418z M20.846,5.505C20.691,5.28,16.98,0,10.5,0C4.02,0,0.309,5.28,0.154,5.505c-0.206,0.3-0.206,0.69,0,0.99C0.309,6.72,4.02,12,10.5,12c6.481,0,10.192-5.28,10.346-5.505C21.052,6.195,21.052,5.805,20.846,5.505z M10.5,10.223c-4.409,0-7.41-3.014-8.438-4.225c1.023-1.212,4.009-4.22,8.438-4.22c4.409,0,7.41,3.011,8.437,4.222C17.907,7.212,14.906,10.223,10.5,10.223z"/>
                                        </svg>
                                        <?=$blog['views']?>
                                    </span>
                                    <span class="main-page__tolganys__item__views">
                                         <svg version="1.1" class="main-page__message-icon" viewBox="0 0 14 13" enable-background="new 0 0 14 13">
                                             <path fill="#999999" d="M9.947,4.264c0.16,0,0.316-0.069,0.432-0.191c0.111-0.12,0.178-0.288,0.178-0.458c0-0.171-0.066-0.34-0.178-0.46c-0.113-0.122-0.27-0.19-0.432-0.19c-0.16,0-0.316,0.068-0.43,0.19c-0.113,0.12-0.179,0.287-0.179,0.46c0,0.17,0.065,0.338,0.179,0.458C9.631,4.194,9.787,4.264,9.947,4.264z M3.445,4.225h4.407c0.336,0,0.609-0.291,0.609-0.649c0-0.359-0.273-0.65-0.609-0.65H3.445c-0.336,0-0.608,0.291-0.608,0.65C2.836,3.934,3.109,4.225,3.445,4.225z M13.392,0H0.609C0.272,0,0,0.291,0,0.65v8.298c0,0.359,0.272,0.64,0.609,0.64h7.152v2.762c0,0.273,0.192,0.517,0.433,0.61C8.262,12.987,8.35,13,8.42,13c0.175,0,0.354-0.087,0.473-0.235l2.525-3.177h1.974c0.336,0,0.608-0.28,0.608-0.64V0.65C14,0.291,13.728,0,13.392,0z M12.783,8.287h-1.647c-0.179,0-0.382,0.09-0.497,0.235l-1.66,2.056v-1.63c0-0.358-0.206-0.661-0.543-0.661H1.217V1.3h11.566V8.287z"/>
                                         </svg>
                                        <?=$blog['comments']?>
                                    </span>
                        </div>
                        <div class="main-page__tolganys__item__author-b floated">
                            <img width="42" height="42" src="/img/ava<?=$i?>.png" class="main-page__tolganys__item__author-img"/>
                            <a href="" class="main-page__tolganys__item__author-link">
                                <?=$blog['author']?>
                            </a>
                        </div>
                    </div>
                </div>
            <?}?>
        </div>
    </div>

    <div class="main-page__rating-b floated">
        <div class="main-page__rating__title-b floated">
            <svg version="1.1" class="main-page__rating__icon" viewBox="0 0 44 36" enable-background="new 0 0 44 36">
                <path fill="#EF7A00" d="M31,16h-6c-0.553,0-1,0.448-1,1v18c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1V17C32,16.448,31.553,16,31,16z M30,34h-4V18h4V34z M7,22H1c-0.552,0-1,0.448-1,1v12c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1V23C8,22.448,7.552,22,7,22z M6,34H2V24h4V34z M43,0h-6c-0.553,0-1,0.448-1,1v34c0,0.553,0.447,1,1,1h6c0.553,0,1-0.447,1-1V1C44,0.448,43.553,0,43,0z M42,34h-4V2h4V34z M19,4h-6c-0.552,0-1,0.448-1,1v30c0,0.553,0.448,1,1,1h6c0.552,0,1-0.447,1-1V5C20,4.448,19.552,4,19,4z M18,34h-4V6h4V34z"/>
            </svg>
            <h3 class="main-page__rating__title">қолданушы<br>рейтингісі</h3>
        </div>
        <div class="main-page__rating">
            <div class="main-page__rating__img-b">
                <img src="/img/ava1.png" class="main-page__rating__img"/>
                <div class="main-page__rating__position">1</div>
            </div>
            <a href="/profile/one"><h3 class="main-page__rating__name">Айгул Сағымбайқызы</h3></a>
            <div> <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text">ғалым</span></div>
        </div>
        <div class="main-page__rating">
            <div class="main-page__rating__img-b">
                <img src="/img/ava2.png" class="main-page__rating__img"/>
                <div class="main-page__rating__position">2</div>
            </div>
            <h3 class="main-page__rating__name">Қанат Орынбасар</h3>
            <div> <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text">әдіскер</span></div>
        </div>
        <div class="main-page__rating">
            <div class="main-page__rating__img-b">
                <img src="/img/ava3.png" class="main-page__rating__img"/>
                <div class="main-page__rating__position">3</div>
            </div>
            <h3 class="main-page__rating__name">Екатерина Ковальчук</h3>
            <div> <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text">әдіскер</span></div>
        </div>
        <div class="main-page__rating">
            <div class="main-page__rating__img-b">
                <img src="/img/ava4.png" class="main-page__rating__img"/>
                <div class="main-page__rating__position">4</div>
            </div>
            <h3 class="main-page__rating__name">Райхан Алиева</h3>
            <div> <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text">ғалым</span></div>
        </div>
        <div class="main-page__rating">
            <div class="main-page__rating__img-b">
                <img src="/img/rating.jpg" class="main-page__rating__img"/>
                <div class="main-page__rating__position">5</div>
            </div>
            <h3 class="main-page__rating__name">Қайрат Кәрім</h3>
            <div> <span class="main-page__rating__status">статус:</span><span class="main-page__rating__status-text">әдіскер</span></div>
        </div>
    </div>

    <div class="main-page__tartu-b">
        <div class="main-page__item__title-b floated">
            <h3 class="main-page__item__title">ТАРТУ</h3>
            <div class="main-page__item__title__tags">
                <span class="main-page__item__title__tag">Кітаптар</span>
                <span class="main-page__item__title__tag">Журналдар</span>
            </div>
        </div>

        <div class="main-page__tartu__items floated">
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img width="184" height="259" src="/img/books/1.jpg" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="/tartu/one" class="main-page__tartu__link js-tartu-b">Оқыңыз</a>
                    </div>
                </div>
                <a href="/tartu/one" class="main-page__tartu__section">Абайдың<br> қара сөздері</a>
                <div class="main-page__tartu__author">Абай Құнанбайұлы</div>
            </div>
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img width="184" height="259" src="/img/books/2.jpg" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="" class="main-page__tartu__link js-tartu-b">Оқыңыз</a>
                    </div>
                </div>
                <a href="" class="main-page__tartu__section">Күнгей көңіл</a>
                <div class="main-page__tartu__author">Мархабат Байғұт</div>
            </div>
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img width="184" height="259" src="/img/books/3.jpg" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="" class="main-page__tartu__link js-tartu-b">Оқыңыз</a>
                    </div>
                </div>
                <a href="" class="main-page__tartu__section">Кәусар</a>
                <div class="main-page__tartu__author">Серікбол Хасан</div>
            </div>
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img width="184" height="259" src="/img/books/4.jpg" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="" class="main-page__tartu__link js-tartu-b">Оқыңыз</a>
                    </div>
                </div>
                <a href="" class="main-page__tartu__section">Өлеңдер</a>
                <div class="main-page__tartu__author">Сағат Әбдуғалиев</div>
            </div>
            <div class="main-page__tartu">
                <div class="main-page__tartu__img-b">
                    <img width="184" height="259" src="/img/books/5.jpg" class="main-page__tartu__img"/>
                    <div class="main-page__tartu__link-b js-tartu-link">
                        <a href="" class="main-page__tartu__link js-tartu-b">Оқыңыз</a>
                    </div>
                </div>
                <a href="" class="main-page__tartu__section">Алуа</a>
                <div class="main-page__tartu__author">Гүлбақыт Қасенова</div>
            </div>
        </div>
    </div>

    <div class="main-page__media-b">
        <div class="main-page__item__title-b floated">
            <h3 class="main-page__item__title">МУЛЬТИМЕДИА</h3>
            <div class="main-page__item__title__tags">
                <span class="main-page__item__title__tag">Барлық видеолар</span>
                <span class="main-page__item__title__tag">Видео сабақтар</span>
                <span class="main-page__item__title__tag">Фотосуреттер</span>
                <span class="main-page__item__title__tag">Инфографика</span>
            </div>
        </div>

        <div class="main-page__media__items floated">
            <?
            $i = 0;
            foreach ($videos as $video) {
                $i++;
                if($i == 1){
                ?>
                <div class="main-page__media">
                    <img width="630" height="430" src="<?=$video['img']?>" class="main-page__img">
                    <div class="main-page__media__text-b">
                        <a href="/article/<?echo $video['id']."-".$video['preview'].".html";?>"><?=$video['title']?></a>
                    </div>
                </div>
            <?}else{?>
                    <div class="main-page__media">
                        <img width="300" height="200" src="<?=$video['img']?>" class="main-page__img">
                        <div class="main-page__media__text-b">
                            <a href="/article/<?echo $video['id']."-".$video['preview'].".html";?>"><?=$video['title']?></a>
                        </div>
                    </div>
            <?}}?>
        </div>
    </div>
</div>